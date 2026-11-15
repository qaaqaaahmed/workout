import { realtime } from "inngest";
import { z } from "zod";

export const geminiChannel = realtime.channel({
  name: ({ workflowId }: { workflowId: string }) => `gemini:${workflowId}`,
  topics: {
    status: {
      schema: z.object({
        status: z.enum(["loading", "success", "error"]),
        nodeId: z.string(),
      }),
    },
  },
});
