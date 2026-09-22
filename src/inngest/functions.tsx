// src/inngest/functions.ts
import prisma from "@/lib/db";
import { inngest } from "./client";

export const processTask = inngest.createFunction(
  { id: "process-task", triggers: { event: "app/task.created" } },
  async ({ event, step }) => {
    const result = await step.run("handle-task", async () => {
      return { processed: true, id: event.data.id };
    });

    await step.sleep("fetching video", "5s");

    await step.sleep("transcribing video", "5s");

    await step.sleep("sending to ai", "5s");

    await prisma.workflow.create({
      data: {
        name: "Workflow from inngest",
      },
    });

    return { message: `Task ${event.data.id} complete`, result };
  },
);
