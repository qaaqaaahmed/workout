"use client";

import { type NodeProps, type Node, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { FormSchemaType, GeminiDialog } from "./dialog";
import { useParams } from "next/navigation";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchGeminiRealtimeToken } from "./actions";

// type HttpRequestNodeData = {
//   variableName?: string;
//   method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
//   endpoint?: string;
//   body?: string;
// };
// type HttpRequestNodeType = Node<HttpRequestNodeData>;

type GeminiNodeData = Partial<FormSchemaType>;
type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
  const { setNodes } = useReactFlow();
  const nodeData = props.data;
  const { workflowId } = useParams<{ workflowId: string }>();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: `gemini:${workflowId}`,
    topic: "status",
    refreshToken: () => fetchGeminiRealtimeToken({ workflowId }),
  });

  const description = nodeData?.userPrompt
    ? `Gemini: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not Configured";

  const [geminiRequestDialogOpen, setGeminiRequestDialogOpen] = useState(false);

  const handleOpenDialog = () => setGeminiRequestDialogOpen(true);

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
      <GeminiDialog
        open={geminiRequestDialogOpen}
        onOpenChange={setGeminiRequestDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/gemini.svg"
        name="Gemini"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenDialog}
        onDoubleClick={handleOpenDialog}
      />
    </>
  );
});

GeminiNode.displayName = "GeminiNode";
