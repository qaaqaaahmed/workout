"use client";

import { CredentialType } from "@/generated/prisma/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  useCreateCredential,
  useSuspenseCredential,
  useUpdateCredential,
} from "../hooks/use-credentials";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
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
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { toast } from "sonner";

interface Props {
  initialData?: {
    id: string;
    name: string;
    type: CredentialType;
    value: string;
  };
}

const formSchema = z.object({
  name: z.string().min(1, { error: "name is required" }),
  value: z.string().min(1, { error: "API Key is required" }),
  type: z.enum(CredentialType),
});

type FormValues = z.infer<typeof formSchema>;

const credentialTypeOptions = [
  {
    name: "openai",
    type: CredentialType.OPENAI,
    logo: "/logos/openai.svg",
  },
  {
    name: "Gemini",
    type: CredentialType.GEMINI,
    logo: "/logos/gemini.svg",
  },
  {
    name: "Anthropic",
    type: CredentialType.ANTHROPIC,
    logo: "/logos/anthropic.svg",
  },
];

export const CredentialForm = ({ initialData }: Props) => {
  const router = useRouter();
  const createCredential = useCreateCredential();
  const updateCredential = useUpdateCredential();
  const { handleError, modal } = useUpgradeModal();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      type: CredentialType.OPENAI,
      value: "",
    },
  });

  const isEditing = !!initialData?.id;

  const handleSubmit = async (values: FormValues) => {
    if (isEditing && initialData.id) {
      await updateCredential.mutateAsync({
        id: initialData.id,
        ...values,
      });
    } else {
      await createCredential.mutateAsync(
        {
          ...values,
        },
        {
          onSuccess: () => {
            router.push(`/credentials`);
          },
          onError: (error) => {
            handleError(error);
          },
        },
      );
    }
  };

  return (
    <>
      {modal}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit credentials" : "Create credentials"}
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Update your api key or credentials details"
              : "create  a new api key or credentials for your account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter a name for your credential"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="type"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credential Type</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {credentialTypeOptions.map((option) => {
                          return (
                            <SelectItem key={option.type} value={option.type}>
                              <div className="flex gap-2">
                                <Image
                                  src={option.logo}
                                  alt={option.name}
                                  width={16}
                                  height={16}
                                />
                                {option.name}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="value"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credential</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="sk-..................."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  disabled={
                    createCredential.isPending || updateCredential.isPending
                  }
                >
                  {isEditing ? "Update" : "Create"}
                </Button>

                <Button type="button" variant="outline" asChild>
                  <Link prefetch href={`/credentials`}>
                    Cancel
                  </Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export const CredentialView = ({ credentialId }: { credentialId: string }) => {
  const { data: credential } = useSuspenseCredential(credentialId);
  return <CredentialForm initialData={credential} />;
};
