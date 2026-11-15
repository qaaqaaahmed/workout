import { realtime } from "inngest";
import { z } from "zod";

export const openaiChannel = realtime.channel({
  name: ({ workflowId }: { workflowId: string }) => `openai:${workflowId}`,
  topics: {
    status: {
      schema: z.object({
        status: z.enum(["loading", "success", "error"]),
        nodeId: z.string(),
      }),
    },
  },
});
