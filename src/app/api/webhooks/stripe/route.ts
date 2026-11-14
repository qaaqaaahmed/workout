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

    const stripeData = {
      eventId: body.id,
      amount: body.amount,
      currency: body.currency,
      eventType: body.type,
      livemode: body.livemode,
      raw: body.data?.object,
    };

    await sendExecuteWorkflow({
      workflowId,
      initialData: { stripe: stripeData },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log("Error processing stripe webhook: ", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process the stripe webhook",
      },
      {
        status: 500,
      },
    );
  }
}
