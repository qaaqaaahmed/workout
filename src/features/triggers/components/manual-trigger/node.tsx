"use client";

import { type NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <BaseTriggerNode
      {...props}
      icon={MousePointerIcon}
      name="When Clicking 'Execute Workflow'"
      //    onSettings={handleOpenSetting}
      //    onDoubleClick={handleOpenSetting}
      //   status={nodeStatus}
    />
  );
});

ManualTriggerNode.displayName = "ManualTrigger";
