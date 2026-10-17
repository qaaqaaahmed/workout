"use client";

import {
  NodeStatus,
  NodeStatusIndicator,
} from "@/components/react-flow/node-status-indicator";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { WorkflowNode } from "@/components/workflow-node";
import { Position, useReactFlow, type NodeProps } from "@xyflow/react";
import { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo } from "react";

interface BaseTriggerNodeProps extends NodeProps {
  id: string;
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: string;
  status?: NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    children,
    onDoubleClick,
    onSettings,
    status = "initial",
  }: BaseTriggerNodeProps) => {
    const { setEdges, setNodes } = useReactFlow();
    const handleDelete = () => {
      setNodes((nodes) => {
        const updatedNodes = nodes.filter((node) => node.id !== id);
        return updatedNodes;
      });

      setEdges((edges) => {
        const updatedEdges = edges.filter(
          (edge) => edge.source !== id && edge.target !== id,
        );
        return updatedEdges;
      });
    };

    return (
      <WorkflowNode
        name={name}
        description={description}
        onSettings={onSettings}
        onDelete={handleDelete}
        showToolbar
      >
        <NodeStatusIndicator
          status={status}
          variant="border"
          className="rounded-l-2xl"
        >
          <BaseNode
            className="rounded-l-2xl relative group"
            onDoubleClick={onDoubleClick}
            status={status}
          >
            <BaseNodeContent>
              {typeof Icon === "string" ? (
                <Image src={Icon} alt={name} width={16} height={16} />
              ) : (
                <Icon className="size-4 text-muted-foreground" />
              )}

              {children}

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

BaseTriggerNode.displayName = "BaseTriggerNode";
