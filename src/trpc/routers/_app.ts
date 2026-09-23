import { z } from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const appRouter = createTRPCRouter({
  testai: baseProcedure.mutation(async ({}) => {
    await inngest.send({
      name: "execute/ai",
    });

    return { success: true, message: "Job has been queued" };
  }),
  getWorkflows: baseProcedure.query(({}) => {
    return prisma.workflow.findMany();
  }),
  create: baseProcedure.mutation(async () => {
    await inngest.send({
      name: "app/task.created",
      data: {
        id: "Workflow from inngest",
      },
    });

    return { success: true, message: "We are processing your request" };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
