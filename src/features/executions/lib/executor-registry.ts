import { ManualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { NodeType } from "@/generated/prisma/enums";
import { NodeExecutor } from "../types";
import { HttpRequestExecutor } from "../components/http-request/executor";
import { googleFormTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { stripeTriggerExecutor } from "@/features/triggers/components/stripe-trigger/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.MANUAL_TRIGGER]: ManualTriggerExecutor,
  [NodeType.INITIAL]: ManualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: HttpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];

  if (!executor) {
    throw new Error(`Could not find the executor for type ${type}`);
  }

  return executor;
};
