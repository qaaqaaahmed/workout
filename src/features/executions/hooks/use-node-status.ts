import { getClientSubscriptionToken, useRealtime } from "inngest/react";
import z from "zod";

interface UseNodeStatusProps {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => ReturnType<typeof getClientSubscriptionToken>;
}

const statusPayloadSchema = z.object({
  status: z.enum(["loading", "success", "error"]),
  nodeId: z.string(),
});

export const useNodeStatus = ({
  nodeId,
  channel,
  topic,
  refreshToken,
}: UseNodeStatusProps) => {
  const { messages } = useRealtime({
    channel: channel,
    topics: [topic],
    token: refreshToken,
  });

  const status =
    messages.all
      .filter(
        (message) =>
          message.kind === "data" &&
          message.topic === topic &&
          message.channel === channel,
      )
      .map((message) => statusPayloadSchema.safeParse(message.data))
      .filter((result) => result.success && result.data.nodeId === nodeId)
      .at(-1)?.data?.status ?? "initial";

  return status;
};
