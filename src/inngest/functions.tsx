// src/inngest/functions.ts
import prisma from "@/lib/db";
import { inngest } from "./client";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";

import * as Sentry from "@sentry/nextjs";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();
export const processTask = inngest.createFunction(
  { id: "execute-ai", triggers: { event: "execute/ai" } },
  async ({ event, step }) => {
    await step.sleep("pretend", "5s");

    Sentry.logger.info("User clicked checkout");
    Sentry.logger.warn("Slow query detected", { queryTime: 2500 });
    Sentry.logger.error("Payment failed", { userId: "abc123" });

    console.warn("This is a warning");
    console.error("This is an error");
    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-3.6-flash"),
        system: "You are a helpful assistant",
        prompt: "What is 2 + 2?",
        experimental_telemetry: {
          isEnabled: true,
          functionId: "joke_agent",
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );

    const { steps: openaiSteps } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        model: openai("gpt-4o"),
        system: "You are a helpful assistant",
        prompt: "What is 5+5?",
        experimental_telemetry: {
          isEnabled: true,
          functionId: "joke_agent",
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );

    const { steps: anthropicSteps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        model: anthropic("claude-opus-4-0"),
        system: "You are a helpful assistant",
        prompt: "What is 5+5?",
        experimental_telemetry: {
          isEnabled: true,
          functionId: "joke_agent",
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );

    return { geminiSteps, openaiSteps, anthropicSteps };
  },
);
