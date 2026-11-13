type googleFormTriggerData = Record<string, unknown>;

import { NodeExecutor } from "@/features/executions/types";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";

export const googleFormTriggerExecutor: NodeExecutor<
  googleFormTriggerData
> = async ({ nodeId, context, step, workflowId }) => {
  const ch = googleFormTriggerChannel({ workflowId });
  await step.realtime.publish(
    `google-form-trigger-loading-${nodeId}`,
    ch.status,
    {
      status: "loading",
      nodeId,
    },
  );
  const result = await step.run("google-form-trigger", async () => context);

  await step.realtime.publish(
    `google-form-trigger-success-${nodeId}`,
    ch.status,
    {
      status: "success",
      nodeId,
    },
  );
  return result;
};
