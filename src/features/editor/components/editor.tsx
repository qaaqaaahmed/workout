"use client";
import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Background,
  Controls,
  MiniMap,
  Panel,
} from "@xyflow/react";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "@/components/add-node-button";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atom";

export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};

export const EditorError = () => {
  return <ErrorView message="Failed to load editor" />;
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  const setEditor = useSetAtom(editorAtom);

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        onInit={setEditor}
        nodeTypes={nodeComponents}
        proOptions={{
          hideAttribution: true,
        }}
        //extra behaviors
        snapGrid={[10, 10]}
        snapToGrid
        panOnScroll // you can use your touch screen to now move, labadha farood just swiping makes the canvas move
        panOnDrag={false} // pressing down on touchscreen now doesnt let you move in the canvas,
        selectionOnDrag // now you can select more than one workflow, like drag over two and both are highlighted and you can delete both at once by delete on your keyboard
      >
        <Background />
        <Controls />
        <MiniMap />

        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
      </ReactFlow>
    </div>
  );
};
