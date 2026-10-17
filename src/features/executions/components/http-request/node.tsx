"use client";

import { type NodeProps, type Node, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { GlobeIcon } from "lucide-react";
import { FormSchemaType, HttpRequestDialog } from "./dialog";

type HttpRequestNodeData = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  endpoint?: string;
  body?: string;
  [key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const { setNodes } = useReactFlow();
  const nodeData = props.data;
  const nodeStatus = "initial";
  const description = nodeData?.endpoint
    ? `${nodeData.method || "GET"}: ${nodeData.endpoint}`
    : "Not Configured";

  const [httpRequestDialogOpen, setHttpRequestDialogOpen] = useState(false);

  const handleOpenDialog = () => setHttpRequestDialogOpen(true);

  const handleSubmit = (values: FormSchemaType) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              endpoint: values.endpoint,
              body: values.body,
              method: values.method,
            },
          };
        }

        return node;
      }),
    );
  };

  return (
    <>
      <HttpRequestDialog
        open={httpRequestDialogOpen}
        onOpenChange={setHttpRequestDialogOpen}
        onSubmit={handleSubmit}
        defaultBody={nodeData.body}
        defaultMethod={nodeData.method}
        defaultUrl={nodeData.endpoint}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenDialog}
        onDoubleClick={handleOpenDialog}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
