"use client";

import { type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";

import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { useParams } from "next/navigation";

import { GoogleFormTriggerDialog } from "./dialog";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";

export const GoogleFormTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenSetting = () => setDialogOpen(true);
  const { workflowId } = useParams<{ workflowId: string }>();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: `google-form-trigger:${workflowId}`,
    topic: "status",
    refreshToken: () => fetchGoogleFormTriggerRealtimeToken({ workflowId }),
  });

  return (
    <>
      <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        id={props.id}
        icon="/logos/googleform.svg"
        name="Google Form"
        description="When form is submitted"
        onSettings={handleOpenSetting}
        onDoubleClick={handleOpenSetting}
        status={nodeStatus}
      />
    </>
  );
});

GoogleFormTriggerNode.displayName = "GoogleFormTriggerNode";
