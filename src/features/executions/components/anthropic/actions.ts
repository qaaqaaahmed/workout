"use server";

import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { requireAuth } from "@/lib/auth-utils";
import prisma from "@/lib/db";
import { anthropicChannel } from "@/inngest/channels/anthropic";

export async function fetchAnthropicRealtimeToken({
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
    channel: anthropicChannel({ workflowId: workflow.id }),
    topics: ["status"],
  });
}
