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
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

interface HttpRequestDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  defaultMethod?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  defaultUrl?: string;
  defaultBody?: string;
  onSubmit: (values: FormSchemaType) => void;
}

const formSchema = z.object({
  endpoint: z.url({ error: "Please provide a valid URL" }),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"], {
    error: "Please choose one of the accepts methods",
  }),
  body: z.string({}).optional(),
});

export type FormSchemaType = z.infer<typeof formSchema>;

export const HttpRequestDialog = ({
  open,
  onOpenChange,
  defaultMethod = "GET",
  defaultBody,
  defaultUrl,
  onSubmit,
}: HttpRequestDialogProps) => {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endpoint: defaultUrl,
      method: defaultMethod,
      body: defaultBody,
    },
  });

  const watchMethod = form.watch("method");
  const showBody = ["POST", "PUT", "PATCH"].includes(watchMethod);

  const handleSubmit = (values: FormSchemaType) => {
    onSubmit(values);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        method: defaultMethod,
        body: defaultBody,
        endpoint: defaultUrl,
      });
    }
  }, [defaultBody, defaultMethod, defaultUrl, form, open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Http Request Settings</DialogTitle>
          <DialogDescription>
            Configure settings for the HTTP request node
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-8 mt-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              name="method"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a method" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormDescription>
                    The HTTP method to use for this request
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              name="endpoint"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint Url</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://api.example.com/{{httpResponse.data.id}}"
                    />
                  </FormControl>

                  <FormDescription>
                    Status URL or use {"{{ variables }}"} for simple values or
                    use {"{{json variable}}"} to stringify objects
                  </FormDescription>
                </FormItem>
              )}
            />

            {showBody && (
              <FormField
                name="body"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body</FormLabel>

                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[120px] font-mono text-sm"
                        placeholder={
                          '{\n "userId": "{{httpResponse.data.id}}", \n "name": "{{httpResponse.data.name}}", \n "items": "{{httpResponse.data.items}}"\n}'
                        }
                      />
                    </FormControl>

                    <FormDescription>
                      JSON with template variables. Use {"{{variables}}"} for
                      simple values or {"{{json variable}}"} to stringify
                      objects
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="mt-4">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
