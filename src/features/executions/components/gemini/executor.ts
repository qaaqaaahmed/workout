import { NonRetriableError } from "inngest";
import { NodeExecutor } from "../../types";
import HandleBars from "handlebars";
import { geminiChannel } from "@/inngest/channels/gemini";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

HandleBars.registerHelper("json", (context) =>
  JSON.stringify(context, null, 2),
);

type geminiData = {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const GeminiExecutor: NodeExecutor<geminiData> = async ({
  data,
  nodeId,
  context,
  step,
  workflowId,
}) => {
  const ch = geminiChannel({ workflowId });
  await step.realtime.publish(`gemini-loading-${nodeId}`, ch.status, {
    status: "loading",
    nodeId,
  });

  if (!data.userPrompt) {
    await step.realtime.publish(`gemini-error-${nodeId}`, ch.status, {
      status: "error",
      nodeId,
    });

    throw new NonRetriableError("GEMINI NODE ERROR: user prompt is missing");
  }

  if (!data.variableName) {
    await step.realtime.publish(`gemini-error-${nodeId}`, ch.status, {
      status: "error",
      nodeId,
    });

    throw new NonRetriableError("GEMINI NODE ERROR: Variable name is missing");
  }

  const systemPrompt = data.systemPrompt
    ? HandleBars.compile(data.systemPrompt, {
        noEscape: true,
      })(context)
    : "You are a helpful assistant";
  const userPrompt = HandleBars.compile(data.userPrompt, { noEscape: true })(
    context,
  );

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY!;

  const google = createGoogleGenerativeAI({ apiKey });
  //TODO: Fetch credentials
  try {
    const { steps } = await step.ai.wrap(
      `gemini-generate-text-${nodeId}`,
      generateText,
      {
        model: google("gemini-3.8-flash"),
        instructions: systemPrompt || "You are a helpful assistant",
        prompt: userPrompt,
        telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );

    const text =
      steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await step.realtime.publish(`gemini-success-${nodeId}`, ch.status, {
      status: "success",
      nodeId,
    });

    return {
      ...context,
      [data.variableName]: {
        aiResponse: text,
      },
    };
  } catch (error) {
    await step.realtime.publish(`gemini-error-${nodeId}`, ch.status, {
      status: "error",
      nodeId,
    });
    throw error;
  }
};

/* 
so to summarize, user sends us the body, they can do whatver they want to send, and our backend checks everything, so backend receives the body,
 and it gives it to handlebars.compile which if it has no placeholders returns what was given to it, 
but if it has placeholders or templates it looks up the context and returns whatever was given to it and replaces the placeholder with the [lookupValue]
 , now if you have helpers, 
 then once handlebars gets the value from the lookup, it passes to the helper which stringifies it. 

then whatever the result is, it is saved into resolved, which is then checked by JSON.parse, to make sure that whatever the user sent is a valid json,
and btw i forgot, we add the no escape to stop the handle bars from escaping by default once the helper runs the value
 or if there are no helper when the value is returned from the look up1

Before compile: data.body?.trim() || "{}", so an empty or spaces-only body becomes "{}"(handlebars only accepts a template string) 
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
