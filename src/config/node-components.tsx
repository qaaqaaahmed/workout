import { InitialNode } from "@/components/initial-node";
import { NodeType } from "@/generated/prisma/enums";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
} as const satisfies NodeTypes;

export type RegistedNodeType = keyof typeof nodeComponents;

// const a: NodeTypes = { a: InitialNode };
// type A = keyof typeof a; this will be string

// const b = { b: InitialNode } satisfies NodeTypes;
// type B = keyof typeof b; this will be b
