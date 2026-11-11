import { realtime } from "inngest";
import { z } from "zod";

export const httpRequestChannel = realtime.channel({
  name: ({ workflowId }: { workflowId: string }) =>
    `http-request:${workflowId}`,
  topics: {
    status: {
      schema: z.object({
        status: z.enum(["loading", "success", "error"]),
        nodeId: z.string(),
      }),
    },
  },
});
