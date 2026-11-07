import { NonRetriableError } from "inngest";
import { NodeExecutor } from "../../types";
import ky, { Options as KyOptions } from "ky";

type httpRequestData = {
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
  if (!endpoint) {
    throw new NonRetriableError("HTTP REQUEST NODE: No endpoint configured");
  }
  const result = await step.run("http-request", async () => {
    const method = data.method || "GET";

    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.body = data.body;
    }
    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
  });
  return result;
};
