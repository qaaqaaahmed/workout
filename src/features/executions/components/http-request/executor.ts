import { NonRetriableError } from "inngest";
import { NodeExecutor } from "../../types";
import ky, { Options as KyOptions } from "ky";
import HandleBars from "handlebars";

HandleBars.registerHelper("json", (context) =>
  JSON.stringify(context, null, 2),
);

type httpRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<httpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  let endpoint = data.endpoint;
  const variableName = data.variableName;
  const method = data.method;
  if (!endpoint) {
    throw new NonRetriableError("HTTP REQUEST NODE: No endpoint configured");
  }

  if (!variableName) {
    throw new NonRetriableError(
      "HTTP REQUEST NODE: Variable name not configured",
    );
  }

  if (!method) {
    throw new NonRetriableError("HTTP REQUEST NODE: No method configured");
  }
  const result = await step.run("http-request", async () => {
    const method = data.method;
    endpoint = HandleBars.compile(endpoint, { noEscape: true })(context);

    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      const resolved = HandleBars.compile(data.body?.trim() || "{}", {
        noEscape: true,
      })(context);

      try {
        JSON.parse(resolved);
      } catch {
        throw new NonRetriableError(
          "HTTP REQUEST NODE: Body is not a valid JSON",
        );
      }

      options.body = resolved;
      options.headers = {
        "Content-Type": "application/json",
      };
    }
    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };

    return {
      ...context,
      [variableName]: responsePayload,
    };
  });
  return result;
};

/* 
so to summarize, user sends us the body, they can do whatver they want to send, and our backend checks everything, so backend receives the body,
 and it gives it to handlebars.compile which if it has no placeholders returns what was given to it, 
but if it has placeholders or templates it looks up the context and returns whatever was given to it and replaces the placeholder with the [lookupValue]
 , now if you have helpers, 
 then once handlerbasrs gets the values, it passers to the helper which stringifies it. 

then whatever the result is is saved into resolved, which is then checked by JSON.parse, to make sure that whatevr the user sent is a valid json,
and btw i forgot, we add the no escape to stop the handle bars from escaping by default once the helper runs the value
 or if there are no helper when the value is returned from the look up

Before compile: data.body?.trim() || "{}", so an empty or spaces-only body becomes "{}"(handlebars only accepts a template string) which is a valid json
After parse: if it passes, send resolved as a string with the Content-Type: application/json header. 
If it fails, throw a NonRetriableError so Inngest doesn’t retry.
*/

/*

“Stringify” means turning a JS value into text that describes it, in JSON format. 
In memory, an object is a structure with keys and values. Stringify writes that structure out as characters:

ts
{ id: 1, title: "hi" }   // the object in memory
'{"id":1,"title":"hi"}'  // the text stringify produces
*/

/*

so it loooks at the object, and looks at the keys and value or the values you have in there, 
and if its key value it checks if the value is not undefined or a function or a symbol and in those case it drops it otherwise it accepots it and stored

Yes. One wording fix: it doesn’t store anything. It writes each key and value into the text it’s building.

For each key in the object:

The value is undefined, a function, or a Symbol: skip it.
Anything else: write "key": followed by the value as JSON.
And “the value as JSON” depends on what it is:

A string gets quotes, with inner quotes escaped
A number or boolean is written as is
A nested object or array: it goes inside and repeats the same process
A Date becomes a date string, and NaN becomes null
*/

/*
oh so jsonstringify esacpes the inner strings, drops keys where values are undefined or function or symbol, 
if its  in array its turned to null, if its top value then its also turned to undefined, and if its bigint or circular i guess stringify throws

Yes, all of that’s right. Two small wording fixes:

It escapes inner quotes (the " characters inside a string), not inner strings.
At the top level, it doesn’t turn anything into undefined. It returns undefined instead of a string.
And add circular references to the BigInt case: both make stringify throw.

*/
