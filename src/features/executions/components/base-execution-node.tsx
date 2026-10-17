"use client";

import { BaseHandle } from "@/components/react-flow/base-handle";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import {
  NodeStatus,
  NodeStatusIndicator,
} from "@/components/react-flow/node-status-indicator";
import { WorkflowNode } from "@/components/workflow-node";
import { Position, type NodeProps } from "@xyflow/react";
import { type LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo } from "react";

interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  status?: NodeStatus;
  children?: React.ReactNode;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseExecutionNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    status = "initial",
    children,
    onSettings,
    onDoubleClick,
  }: BaseExecutionNodeProps) => {
    const handleDelete = () => {};
    return (
      <WorkflowNode
        name={name}
        description={description}
        onDelete={handleDelete}
        onSettings={onSettings}
        showToolbar={true}
      >
        <NodeStatusIndicator status={status} variant="border">
          <BaseNode onDoubleClick={onDoubleClick} status={status}>
            <BaseNodeContent>
              {typeof Icon === "string" ? (
                <Image src={Icon} alt={name} width={16} height={16} />
              ) : (
                <Icon className="size-5 text-muted-foreground" />
              )}
              {children}
              <BaseHandle
                id="target-1"
                type="target"
                position={Position.Left}
              />
              <BaseHandle
                id="source-1"
                type="source"
                position={Position.Right}
              />
            </BaseNodeContent>
          </BaseNode>
        </NodeStatusIndicator>
      </WorkflowNode>
    );
  },
);

BaseExecutionNode.displayName = "BaseExecutionNode";
