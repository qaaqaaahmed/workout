import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";

type EntityHeaderProps = {
  title: string;
  description?: string;
  newButtonLabel: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { onNew?: never; newButtonHref?: never }
);

export const EntityHeader = ({
  title,
  description,
  newButtonLabel,
  newButtonHref,
  disabled,
  isCreating,
  onNew,
}: EntityHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-x-4">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
        {description && (
          <p className="text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {onNew && !newButtonHref && (
        <Button disabled={disabled || isCreating} onClick={onNew} size="sm">
          <PlusIcon className="size-4" />
          {newButtonLabel}
        </Button>
      )}

      {!onNew && newButtonHref && (
        <Button size="sm" asChild>
          <Link prefetch href={newButtonHref}>
            {newButtonLabel}
          </Link>
        </Button>
      )}
    </div>
  );
};

interface EntityPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const EntityPagination = ({
  page,
  totalPages,
  onPageChange,
  disabled,
}: EntityPaginationProps) => {
  return (
    <div className="flex items-center justify-between gap-x-4 w-full">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </div>

      <div className="flex items-center justify-end gap-x-2 py-4">
        <Button
          disabled={disabled || page === 1}
          variant="outline"
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Previous
        </Button>

        <Button
          variant="outline"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={disabled || page === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

type EntityContainerProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
};

export const EntityContainer = ({
  children,
  header,
  search,
  pagination,
}: EntityContainerProps) => {
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="flex flex-col gap-y-8 max-w-7xl mx-auto w-full h-full">
        {header}

        <div className="flex flex-col gap-y-4 h-full">
          {search}
          {children}
        </div>

        {pagination}
      </div>
    </div>
  );
};

interface EntitySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const EntitySearch = ({
  value,
  onChange,
  placeholder = "Search",
}: EntitySearchProps) => {
  return (
    <div className="relative ml-auto">
      <SearchIcon className="absolute size-3.5 text-muted-foreground left-3 top-1/2 -translate-y-1/2 " />
      <Input
        className="max-w-[200px] pl-8 bg-background border-border text-muted-foreground shadow-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};
