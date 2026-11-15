"use server";

import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { requireAuth } from "@/lib/auth-utils";
import prisma from "@/lib/db";
import { openaiChannel } from "@/inngest/channels/openai";

export async function fetchOpenaiRealtimeToken({
  workflowId,
}: {
  workflowId: string;
}): ReturnType<typeof getClientSubscriptionToken> {
  const session = await requireAuth();

  const workflow = await prisma.workflow.findUniqueOrThrow({
    where: {
      id: workflowId,
      userId: session.user.id,
    },
  });
  return getClientSubscriptionToken(inngest, {
    channel: openaiChannel({ workflowId: workflow.id }),
    topics: ["status"],
  });
}
