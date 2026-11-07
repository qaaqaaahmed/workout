type manualTriggerData = Record<string, unknown>;

import { NodeExecutor } from "@/features/executions/types";

export const manualTriggerExecutor: NodeExecutor<manualTriggerData> = async ({
  nodeId,
  context,
  step,
}) => {
  const result = await step.run("manual-trigger", async () => context);
  return result;
};
