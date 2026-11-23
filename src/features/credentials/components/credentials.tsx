"use client";

import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useRouter } from "next/navigation";

import { useEntitySearch } from "../hooks/use-entity-search";
import type { Credential } from "@/generated/prisma/client";
import { CredentialType } from "@/generated/prisma/enums";

import { formatDistanceToNow } from "date-fns";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "../hooks/use-credentials";
import Image from "next/image";

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <EntityHeader
      title="Credentials"
      description="Create and manage credentials"
      newButtonLabel="Create credential"
      newButtonHref="/credentials/new"
      disabled={disabled}
    />
  );
};

export const CredentialsSearch = () => {
  const [params, setParams] = useCredentialsParams();

  const { searchValue, onSearchValue } = useEntitySearch({ params, setParams });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchValue}
      placeholder="Search credentials"
    />
  );
};

export const CredentialsList = () => {
  // throw new Error("test");
  const credentials = useSuspenseCredentials();

  return (
    <EntityList
      items={credentials.data.items}
      getKey={(credential) => credential.id}
      renderItem={(credential) => <CredentialsItem data={credential} />}
      emptyView={<CredentialsEmpty />}
    />
  );
};

const credentialLogos: Record<CredentialType, string> = {
  [CredentialType.ANTHROPIC]: "/logos/anthropic.svg",
  [CredentialType.GEMINI]: "/logos/gemini.svg",
  [CredentialType.OPENAI]: "/logos/openai.svg",
};

export const CredentialsItem = ({ data }: { data: Credential }) => {
  const removeCredential = useRemoveCredential();
  const logo = credentialLogos[data.type];

  const handleRemove = () => {
    removeCredential.mutate({ id: data.id });
  };
  return (
    <EntityItem
      href={`/credentials/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}{" "}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <Image src={logo} alt={data.type} width={16} height={16} />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  );
};

export const CredentialsPagination = () => {
  const [params, setParams] = useCredentialsParams();
  const credentials = useSuspenseCredentials();
  return (
    <EntityPagination
      page={credentials.data.page}
      disabled={credentials.isFetching}
      totalPages={credentials.data.totalPages}
      onPageChange={(page) => setParams({ ...params, page: page })}
    />
  );
};

export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialsHeader />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const CredentialsLoading = () => {
  return <LoadingView message="Loading credentials..." />;
};

export const CredentialsError = () => {
  return <ErrorView message="Failed to load credentials" />;
};

export const CredentialsEmpty = () => {
  const router = useRouter();

  const handleCreate = () => {
    router.push(`/credentials/new`);
  };
  return (
    <EmptyView
      message="You have not created any credentials. Please create a credential to use in your workflows"
      onNew={handleCreate}
    />
  );
};
