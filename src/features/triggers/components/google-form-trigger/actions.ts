"use server";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";
import { inngest } from "@/inngest/client";
import { requireAuth } from "@/lib/auth-utils";
import prisma from "@/lib/db";
import { Realtime } from "inngest";
import { getClientSubscriptionToken } from "inngest/react";

export async function fetchGoogleFormTriggerRealtimeToken({
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
    channel: googleFormTriggerChannel({ workflowId: workflow.id }),
    topics: ["status"],
  });
}
