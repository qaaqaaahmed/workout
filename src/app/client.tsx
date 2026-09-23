"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const Client = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const { data: workflows } = useSuspenseQuery(
    trpc.getWorkflows.queryOptions(),
  );
  const queryClient = useQueryClient();

  const create = useMutation(
    trpc.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message);
      },
    }),
  );

  const testAi = useMutation(
    trpc.testai.mutationOptions({
      onSuccess: () => {
        toast.success("ai job queued");
      },
    }),
  );
  return (
    <div className="h-screen w-screen flex flex-col gap-6 items-center justify-center">
      {JSON.stringify(workflows)}

      <Button onClick={() => create.mutate()} disabled={create.isPending}>
        Create workflow
      </Button>

      <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>
        Test ai
      </Button>
      <Button
        onClick={() =>
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/login");
              },
            },
          })
        }
      >
        Logoout
      </Button>
    </div>
  );
};
