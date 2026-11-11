"use server";

import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { inngest } from "@/inngest/client";
import { requireAuth } from "@/lib/auth-utils";
import prisma from "@/lib/db";
import { Realtime } from "inngest";
import { getClientSubscriptionToken } from "inngest/react";

export async function fetchManualTriggerRealtimeToken({
  workflowId,
}: {
  workflowId: string;
}): Promise<Realtime.Subscribe.ClientToken> {
  const session = await requireAuth();

  const workflow = await prisma.workflow.findUniqueOrThrow({
    where: {
      id: workflowId,
      userId: session.user.id,
    },
  });

  return getClientSubscriptionToken(inngest, {
    channel: manualTriggerChannel({ workflowId: workflow.id }),
    topics: ["status"],
  });
}
