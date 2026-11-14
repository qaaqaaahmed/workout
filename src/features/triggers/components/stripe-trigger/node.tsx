"use client";

import { type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { useParams } from "next/navigation";
import { StripeTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchStripeTriggerRealtimeToken } from "./actions";

export const StripeTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenSetting = () => setDialogOpen(true);
  const { workflowId } = useParams<{ workflowId: string }>();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: `stripe-trigger:${workflowId}`,
    topic: "status",
    refreshToken: () => fetchStripeTriggerRealtimeToken({ workflowId }),
  });

  return (
    <>
      <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        id={props.id}
        icon="/logos/stripe.svg"
        name="Stripe"
        description="When stripe event is captured"
        onSettings={handleOpenSetting}
        onDoubleClick={handleOpenSetting}
        status={nodeStatus}
      />
    </>
  );
});

StripeTriggerNode.displayName = "StripeTriggerNode";
