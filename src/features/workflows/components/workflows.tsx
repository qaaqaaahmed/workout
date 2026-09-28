"use client";

import {
  EntityContainer,
  EntityHeader,
  EntityPagination,
  EntitySearch,
} from "@/components/entity-components";
import {
  useCreateWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
import { useRouter } from "next/navigation";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useWorkflowParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "../hooks/use-entity-search";

export const WorkflowsSearch = () => {
  const [params, setParams] = useWorkflowParams();

  const { searchValue, onSearchValue } = useEntitySearch({ params, setParams });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchValue}
      placeholder="Search workflows"
    />
  );
};

export const WorkflowsPagination = () => {
  const [params, setParams] = useWorkflowParams();
  const workflows = useSuspenseWorkflows();
  return (
    <EntityPagination
      page={workflows.data.page}
      disabled={workflows.isFetching}
      totalPages={workflows.data.totalPages}
      onPageChange={(page) => setParams({ ...params, page: page })}
    />
  );
};

export const WorkflowsList = () => {
  const { data } = useSuspenseWorkflows();

  return (
    <div className="flex-1 flex items-center justify-center">
      {JSON.stringify(data, null, 2)}
    </div>
  );
};

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
  const router = useRouter();
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();

  const handleCreateWorkflow = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => {
        //upgrade modal opens
        handleError(error);
      },
    });
  };
  return (
    <>
      {modal}
      <EntityHeader
        title="Workflows"
        description="Create and manage workflows"
        newButtonLabel="Create workflow"
        onNew={handleCreateWorkflow}
        isCreating={false}
        disabled={disabled}
      />
    </>
  );
};

export const WorkflowsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntityContainer>
  );
};
