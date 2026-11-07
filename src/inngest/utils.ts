import { Connection, Node } from "@/generated/prisma/client";
import toposort from "toposort";

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[],
): Node[] => {
  //if there is no connections then just return the nodes
  // get all the connections[fromNodeId, toNodeId] as edges, put them in a list for toposort
  //there could be cases of nodes which have no connections, need to add them to edges
  //then we pass the list of lists to toposort to sort the dependencies
  //then we spread the reuslt in an [... new Set()] to remove duplicates
  //########################### version from source code is wrong, made some changes explained below
  // now we have the sorted ids from toposort, we create a map for nodes and jsut do a look up and return the nodes
  // ##############################ignore all of this because the hack fof looping over all the nodes then pushing to edges the nodes that are not in
  // ##############################connections seems to be causing a cyclic issue since we are pushing [node.id, node.id] which is cyclic
  /* toposort.array takes every node id (so loose nodes are included) as first argument
   plus the real connections as second argument, and returns ids in execution order
   A self-edge hack from the source code used to cause false "cyclic" errors. */

  const edges: [string, string][] = connections.map((conn) => [
    conn.fromNodeId,
    conn.toNodeId,
  ]);

  let sortedNodes: string[];

  try {
    sortedNodes = toposort.array(
      nodes.map((node) => node.id),
      edges,
    ); // toposort will return an array of all the node ids arranging them in dependency order from left to right
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cyclic")) {
      throw new Error("Workflow contains cyclic");
    }
    throw error;
  }

  //lets create a dictionary of all the nodes with their ids being the key for lookup
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  return sortedNodes.map((id) => nodeMap.get(id)!);
};
