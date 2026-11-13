type manualTriggerData = Record<string, unknown>;

import { NodeExecutor } from "@/features/executions/types";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";

export const ManualTriggerExecutor: NodeExecutor<manualTriggerData> = async ({
  nodeId,
  context,
  step,
  workflowId,
}) => {
  const ch = manualTriggerChannel({ workflowId });
  await step.realtime.publish(`manual-trigger-loading-${nodeId}`, ch.status, {
    status: "loading",
    nodeId,
  });
  const result = await step.run("manual-trigger", async () => context);

  await step.realtime.publish(`manual-trigger-success-${nodeId}`, ch.status, {
    status: "success",
    nodeId,
  });
  return result;
};
