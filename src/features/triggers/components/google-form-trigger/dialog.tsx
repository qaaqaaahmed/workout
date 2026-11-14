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
import { generateGoogleFormScript } from "./utils";

interface GoogleFormTriggerProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export const GoogleFormTriggerDialog = ({
  open,
  onOpenChange,
}: GoogleFormTriggerProps) => {
  const { workflowId } = useParams<{ workflowId: string }>();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

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
          <DialogTitle>Google Form Trigger Configuration</DialogTitle>
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
              <li>Open your google form</li>
              <li>Click the three dots menu &rarr; Script Editor</li>
              <li>Copy and paste the script below</li>
              <li>Replace WEBHOOK_URL with your webhook url above</li>
              <li>Save and click &quot;Triggers&quot; &rarr; Add Trigger</li>
              <li>Choose: From form &rarr; On form submit &rarr; Save</li>
            </ol>
          </div>

          <div className="rounded-lg p-4 bg-muted space-y-3">
            <h4 className="text-sm font-medium">Google Apps Script</h4>
            <Button
              variant="outline"
              type="button"
              onClick={async () => {
                const script = generateGoogleFormScript(webhookUrl);
                try {
                  await navigator.clipboard.writeText(script);
                  toast.success("Script copied to clipboard");
                } catch {
                  toast.error("Failed to copy script to clipboard");
                }
              }}
            >
              <CopyIcon className="size-4" />
              Copy google Apps Script
            </Button>
            <p className="text-xs text-muted-foreground">
              This script includes your webhook url and handles form submissions
            </p>
          </div>

          <div className="rounded-lg bg-muted space-y-2">
            <h4 className="text-sm font-medium">Available Variables</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{googleForm.respondentEmail}}"}
                </code>
                - Respondent&apos;s email
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{googleForm.responses['Question Name']}}"}
                </code>
                - Specific answer
              </li>

              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json googleForm.responses}}"}
                </code>
                - All responses as JSON
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
