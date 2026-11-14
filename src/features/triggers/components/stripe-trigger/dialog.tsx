"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface StripeTriggerProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export const StripeTriggerDialog = ({
  open,
  onOpenChange,
}: StripeTriggerProps) => {
  const { workflowId } = useParams<{ workflowId: string }>();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success(`Webhook url copied to clipboard`);
    } catch {
      toast.error("Failed to copy webhook url to clipboard");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stripe Trigger Configuration</DialogTitle>
          <DialogDescription>
            Use this webhook URL in your Google Form Appscript to trigger this
            workflow when a form is submitted
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook_url">Webhook Url</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                id="webhook_url"
                className="font-mono text-sm"
                value={webhookUrl}
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={copyToClipboard}
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">Set Up instructions:</h4>
            <ol className="text-muted-foreground list-decimal list-inside text-sm space-y-1">
              <li>Open your stripe dashboard</li>
              <li>Go to devolopers &rarr; Webhooks</li>
              <li>Click &quot;add endpoint&quot;</li>
              <li>Paste the webhook url above</li>
              <li>
                Select events to listen for (e.g payment_intent.succeeded)
              </li>
              <li>Save and copy the signing secret</li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted space-y-2">
            <h4 className="text-sm font-medium">Available Variables</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.amount}}"}
                </code>
                - Payment amount
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.currency}}"}
                </code>
                - Currency Code
              </li>

              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.customerId}}"}
                </code>
                - Customer ID
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json stripe}}"}
                </code>
                - Full event data as json
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.eventType}}"}
                </code>
                - Event Type (e.g payment_intent.succeeded)
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
