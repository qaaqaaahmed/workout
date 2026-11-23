"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGetCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

interface OpenaiDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  defaultValues: Partial<FormSchemaType>;
  onSubmit: (values: FormSchemaType) => void;
}

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { error: "Variable Name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      error:
        "Variable Name must start with a letter an underscore or $ and must contain only a letter, a number or an underscore or $",
    }),
  credentialId: z.string().min(1, { error: "Credential ID is required" }),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, { error: "User Prompt is required" }),
});

export type FormSchemaType = z.infer<typeof formSchema>;

export const OpenaiDialog = ({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
}: OpenaiDialogProps) => {
  const { data: credentials, isLoading: isLoadingCredentials } =
    useGetCredentialsByType(CredentialType.OPENAI);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      systemPrompt: defaultValues.systemPrompt || "",
      credentialId: defaultValues.credentialId || "",
      userPrompt: defaultValues.userPrompt || "",
      variableName: defaultValues.variableName || "",
    },
  });

  const watchVariableName = form.watch("variableName") || "myOpenai";

  const handleSubmit = (values: FormSchemaType) => {
    onSubmit(values);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        credentialId: defaultValues.credentialId || "",
        userPrompt: defaultValues.userPrompt || "",
        systemPrompt: defaultValues.systemPrompt || "",
      });
    }
  }, [defaultValues, form, open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Openai Configurations</DialogTitle>
          <DialogDescription>
            Configure the ai model for this node
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-8 mt-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              name="variableName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="myOpenai" {...field} />
                  </FormControl>
                  <FormDescription>
                    Use this name to reference the result in other nodes.{" "}
                    {`{{${watchVariableName}.aiResponse}}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="credentialId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gemini Credential</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoadingCredentials || !credentials?.length}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="select a credential" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {credentials?.map((credential) => (
                        <SelectItem key={credential.id} value={credential.id}>
                          <div className="flex items-center gap-2">
                            <Image
                              src={`/logos/openai.svg`}
                              alt={credential.type}
                              width={16}
                              height={16}
                            />
                            {credential.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="systemPrompt"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt (Optional)</FormLabel>

                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[80px] font-mono text-sm"
                      placeholder="You are a helful assistant"
                    />
                  </FormControl>

                  <FormDescription>
                    Sets the behavior of the model. Use {"{{variables}}"} for
                    simple values or {"{{json variable}}"} to stringify objects
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="userPrompt"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Prompt (Required)</FormLabel>

                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[120px] font-mono text-sm"
                      placeholder={`Summarize this text: {{json myOpenai.data}}`}
                    />
                  </FormControl>

                  <FormDescription>
                    The prompt to send to the ai. Use {"{{variables}}"} for
                    simple values or {"{{json variable}}"} to stringify objects
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
