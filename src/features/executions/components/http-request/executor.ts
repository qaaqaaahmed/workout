import { NonRetriableError } from "inngest";
import { NodeExecutor } from "../../types";
import ky, { Options as KyOptions } from "ky";

type httpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<httpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  const endpoint = data.endpoint;
  const variableName = data.variableName;
  if (!endpoint) {
    throw new NonRetriableError("HTTP REQUEST NODE: No endpoint configured");
  }

  if (!variableName) {
    throw new NonRetriableError("Variable name not configured");
  }

  const result = await step.run("http-request", async () => {
    const method = data.method || "GET";

    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.body = data.body;
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

    //only reason im doing the check is to match source code, otherwise i wouldnt need the if, i could just retrun {...context, [varaibleName]: responsePayload}
    if (data.variableName) {
      return {
        ...context,
        [data.variableName]: { ...responsePayload },
      };
    }

    //for backwards compatibility --- not needed if i went with the [variableName]:responsePayload instead of [data.responsePayload]
    // NOTE: unreachable, the throw above guarantees variableName.
    // Kept to match Antonio's source. In my own project: delete the if/fallback
    // and just return { ...context, [variableName]: responsePayload }
    return {
      ...context,
      ...responsePayload,
    };
  });
  return result;
};
