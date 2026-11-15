"use client";

import { type NodeProps, type Node, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { AnthropicDialog, FormSchemaType } from "./dialog";
import { useParams } from "next/navigation";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchAnthropicRealtimeToken } from "./actions";

// type HttpRequestNodeData = {
//   variableName?: string;
//   method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
//   endpoint?: string;
//   body?: string;
// };
// type HttpRequestNodeType = Node<HttpRequestNodeData>;

type AnthropicNodeData = Partial<FormSchemaType>;
type AnthropicNodeType = Node<AnthropicNodeData>;

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {
  const { setNodes } = useReactFlow();
  const nodeData = props.data;
  const { workflowId } = useParams<{ workflowId: string }>();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: `anthropic:${workflowId}`,
    topic: "status",
    refreshToken: () => fetchAnthropicRealtimeToken({ workflowId }),
  });

  const description = nodeData?.userPrompt
    ? `claude-sonnet-4-5: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not Configured";

  const [anthropicRequestDialogOpen, setAnthropicRequestDialogOpen] =
    useState(false);

  const handleOpenDialog = () => setAnthropicRequestDialogOpen(true);

  const handleSubmit = (values: FormSchemaType) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...values,
            },
          };
        }

        return node;
      }),
    );
  };

  return (
    <>
      <AnthropicDialog
        open={anthropicRequestDialogOpen}
        onOpenChange={setAnthropicRequestDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/anthropic.svg"
        name="Anthropic"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenDialog}
        onDoubleClick={handleOpenDialog}
      />
    </>
  );
});

AnthropicNode.displayName = "AnthropicNode";
