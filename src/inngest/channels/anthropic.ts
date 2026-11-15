import { realtime } from "inngest";
import { z } from "zod";

export const anthropicChannel = realtime.channel({
  name: ({ workflowId }: { workflowId: string }) => `anthropic:${workflowId}`,
  topics: {
    status: {
      schema: z.object({
        status: z.enum(["loading", "success", "error"]),
        nodeId: z.string(),
      }),
    },
  },
});
