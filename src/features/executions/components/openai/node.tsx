"use client";

import { type NodeProps, type Node, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { FormSchemaType, OpenaiDialog } from "./dialog";
import { useParams } from "next/navigation";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchOpenaiRealtimeToken } from "./actions";

// type HttpRequestNodeData = {
//   variableName?: string;
//   method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
//   endpoint?: string;
//   body?: string;
// };
// type HttpRequestNodeType = Node<HttpRequestNodeData>;

type OpenaiNodeData = Partial<FormSchemaType>;
type OpenaiNodeType = Node<OpenaiNodeData>;

export const OpenaiNode = memo((props: NodeProps<OpenaiNodeType>) => {
  const { setNodes } = useReactFlow();
  const nodeData = props.data;
  const { workflowId } = useParams<{ workflowId: string }>();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: `openai:${workflowId}`,
    topic: "status",
    refreshToken: () => fetchOpenaiRealtimeToken({ workflowId }),
  });

  const description = nodeData?.userPrompt
    ? `Openai: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not Configured";

  const [openaiRequestDialogOpen, setOpenaiRequestDialogOpen] = useState(false);

  const handleOpenDialog = () => setOpenaiRequestDialogOpen(true);

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
      <OpenaiDialog
        open={openaiRequestDialogOpen}
        onOpenChange={setOpenaiRequestDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/openai.svg"
        name="Openai"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenDialog}
        onDoubleClick={handleOpenDialog}
      />
    </>
  );
});

OpenaiNode.displayName = "OpenaiNode";
