import { sendExecuteWorkflow } from "@/inngest/utils";
import { type NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const workflowId = url.searchParams.get("workflowId");
    if (!workflowId) {
      return NextResponse.json(
        { success: false, error: "Url missing required parameter: WorkflowId" },
        { status: 400 },
      );
    }

    const body = await req.json();

    const formData = {
      formId: body.formId,
      formTitle: body.formTitle,
      responseId: body.responseId,
      timestamp: body.timestamp,
      respondentEmail: body.respondentEmail,
      responses: body.responses,
      raw: body,
    };

    await sendExecuteWorkflow({
      workflowId,
      initialData: { googleForm: formData },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log("Error processing webhook: ", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process the webhook",
      },
      {
        status: 500,
      },
    );
  }
}
