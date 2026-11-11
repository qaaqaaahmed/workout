"use server";

import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { requireAuth } from "@/lib/auth-utils";
import prisma from "@/lib/db";

export async function fetchHttpRequestRealtimeToken({
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
    channel: httpRequestChannel({ workflowId: workflow.id }),
    topics: ["status"],
  });
}
