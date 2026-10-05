"use client";

import { NodeToolbar, Position } from "@xyflow/react";
import { Button } from "./ui/button";
import { SettingsIcon, TrashIcon } from "lucide-react";

interface WorkflowNodeProps {
  children: React.ReactNode;
  name?: string;
  description?: string;
  onDelete?: () => void;
  onSettings?: () => void;
  showToolbar?: boolean;
}

export const WorkflowNode = ({
  children,
  name,
  description,
  onDelete,
  onSettings,
  showToolbar = false,
}: WorkflowNodeProps) => {
  return (
    <>
      {showToolbar && (
        <NodeToolbar>
          <Button size="sm" onClick={onSettings} variant="ghost">
            <SettingsIcon className="size-4" />
          </Button>

          <Button size="sm" onClick={onDelete} variant="ghost">
            <TrashIcon className="size-4" />
          </Button>
        </NodeToolbar>
      )}

      {children}

      {name && (
        <NodeToolbar
          isVisible
          position={Position.Bottom}
          className="max-w-[200px] text-center"
        >
          <p className="font-medium">{name}</p>

          {description && (
            <p className="truncate text-muted-foreground text-sm">
              {description}
            </p>
          )}
        </NodeToolbar>
      )}
    </>
  );
};
