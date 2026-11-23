import { prefetch, trpc } from "@/trpc/server";
import { inferInput } from "@trpc/tanstack-react-query";

export type InputType = inferInput<typeof trpc.credentials.getMany>;

export const prefetchCredentials = (params: InputType) => {
  return prefetch(trpc.credentials.getMany.queryOptions(params));
};

export const prefetchCredential = (id: string) => {
  return prefetch(trpc.credentials.getOne.queryOptions({ id }));
};
