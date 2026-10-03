"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  useSuspenseWorkflow,
  useUpdateWorkflowName,
} from "@/features/workflows/hooks/use-workflows";
import { SaveIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export const EditorSaveButton = () => {
  return (
    <div className="">
      <Button size="sm" onClick={() => {}} disabled={false}>
        <SaveIcon className="size-4" />
        Save
      </Button>
    </div>
  );
};

export const EditorInputName = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workflow.name);
  const updateWorkflowName = useUpdateWorkflowName();

  const inputRef = useRef<HTMLInputElement>(null);

  // if is editing is true, then i want to focus on the input
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  //if workflow name changes, like if an invalidation happens then because there is new workflow.name, i want my local name
  //to update as well... since as long as this component is not unmounted, the name of value would remain whatever user has typed on the input,
  //so to keep everything in sync, we make sure -> hey once workflow.name changes, lets also update our localstate to that value
  useEffect(() => {
    setName(workflow.name);
  }, [workflow.name]);

  const handleSave = async () => {
    if (name === workflow.name) {
      setIsEditing(false);
      return;
    }

    try {
      await updateWorkflowName.mutateAsync({ id: workflow.id, name });
    } catch {
      setName(workflow.name); // basically if the request fails, then we want our local state for input to go back to workflow.name so that it matches the breadcrumb
    } finally {
      // in all cases  setisediting to false because whether user succeeds or fails we want user to move from editing fails since they are done
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setName(workflow.name);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        disabled={updateWorkflowName.isPending}
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-7 min-w-[200px] w-auto px-2"
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <BreadcrumbItem
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:text-foreground transition-colors"
    >
      {workflow.name}
    </BreadcrumbItem>
  );
};

// export const EditorInputName = ({ workflowId }: { workflowId: string }) => {
//   const { data: workflow } = useSuspenseWorkflow(workflowId);
//   const updateWorkflowName = useUpdateWorkflowName();
//   const [isEditing, setIsEditing] = useState(false);
//   const [name, setName] = useState(workflow.name);
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (workflow.name) {
//       setName(workflow.name);
//     }
//   }, [workflow.name]);

//   useEffect(() => {
//     if (isEditing && inputRef.current) {
//       inputRef.current.focus();
//       inputRef.current.select();
//     }
//   }, [isEditing]);

//   const handleSave = async () => {
//     if (name === workflow.name) {
//       setIsEditing(false);
//       return;
//     }

//     try {
//       await updateWorkflowName.mutateAsync({ id: workflow.id, name });
//     } catch {
//       setName(workflow.name);
//     } finally {
//       setIsEditing(false);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       handleSave();
//     } else if (e.key === "Escape") {
//       setName(workflow.name);
//       setIsEditing(false);
//     }
//   };

//   if (isEditing) {
//     return (
//       <Input
//         disabled={updateWorkflowName.isPending}
//         ref={inputRef}
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         onBlur={handleSave}
//         onKeyDown={handleKeyDown}
//         className="h-7 min-w-[100px] px-2 w-auto "
//       />
//     );
//   }
//   return (
//     <BreadcrumbItem
//       onClick={() => setIsEditing(true)}
//       className="cursor-pointer hover:text-foreground transition-colors"
//     >
//       {workflow.name}
//     </BreadcrumbItem>
//   );
// };

const EditorBreadCrumb = ({ workflowId }: { workflowId: string }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link prefetch href={`/workflows`}>
              Workflows
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        <EditorInputName workflowId={workflowId} />
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export const EditorHeader = ({ workflowId }: { workflowId: string }) => {
  return (
    <header className="h-14 bg-background border-b px-4 flex items-center gap-2 ">
      <SidebarTrigger />

      <div className="flex items-center justify-between gap-x-4 w-full">
        <EditorBreadCrumb workflowId={workflowId} />
        <EditorSaveButton />
      </div>
    </header>
  );
};
