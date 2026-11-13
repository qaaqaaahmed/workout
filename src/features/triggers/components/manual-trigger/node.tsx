"use client";

import { type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { useParams } from "next/navigation";
import { fetchManualTriggerRealtimeToken } from "./actions";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenSetting = () => setDialogOpen(true);
  const { workflowId } = useParams<{ workflowId: string }>();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: `manual-trigger:${workflowId}`,
    topic: "status",
    refreshToken: () => fetchManualTriggerRealtimeToken({ workflowId }),
  });

  return (
    <>
      <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        id={props.id}
        icon={MousePointerIcon}
        name="When Clicking 'Execute Workflow'"
        onSettings={handleOpenSetting}
        onDoubleClick={handleOpenSetting}
        status={nodeStatus}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTrigger";
