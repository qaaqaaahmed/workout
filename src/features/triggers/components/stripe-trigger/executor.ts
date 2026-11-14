type stripeTriggerExecutor = Record<string, unknown>;

import { NodeExecutor } from "@/features/executions/types";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";

export const stripeTriggerExecutor: NodeExecutor<
  stripeTriggerExecutor
> = async ({ nodeId, context, step, workflowId }) => {
  const ch = stripeTriggerChannel({ workflowId });
  await step.realtime.publish(`stripe-trigger-loading-${nodeId}`, ch.status, {
    status: "loading",
    nodeId,
  });
  const result = await step.run("stripe-trigger", async () => context);

  await step.realtime.publish(`stripe-trigger-success-${nodeId}`, ch.status, {
    status: "success",
    nodeId,
  });
  return result;
};
