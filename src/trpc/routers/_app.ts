import { z } from "zod";
import { createTRPCRouter } from "../init";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { workflowsRouter } from "@/features/workflows/server/routers";
import { credentialsRouter } from "@/features/credentials/server/routers";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credentials: credentialsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
