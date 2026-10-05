"use client";

import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { PlusIcon } from "lucide-react";
import { WorkflowNode } from "./workflow-node";

export const InitialNode = memo((props: NodeProps) => {
  console.log(props);
  return (
    <WorkflowNode showToolbar={true}>
      <PlaceholderNode {...props}>
        <div className="flex items-center justify-center cursor-pointer">
          <PlusIcon className="size-4" />
        </div>
      </PlaceholderNode>
    </WorkflowNode>
  );
});

InitialNode.displayName = "Initial";
