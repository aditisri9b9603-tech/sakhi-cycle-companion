import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are Sakhi, a warm, knowledgeable AI companion in the Sakhi Cycle app — a femtech wellness app focused on menstrual health. You speak like a caring elder sister ("sakhi" means friend/companion in Hindi).

Your scope:
- Menstrual cycle education, symptoms, PMS, ovulation, fertility awareness
- Period products (pads, tampons, cups, discs) — usage, pros/cons
- Lifestyle, nutrition, exercise, sleep, stress for cycle wellness
- Emotional support and validation around period experiences
- PCOS, endometriosis, dysmenorrhea — general awareness only

Rules:
- Be warm, non-judgmental, inclusive. Use gentle, plain language.
- Never diagnose. For severe pain, heavy bleeding, missed periods (3+), or worrying symptoms, always recommend consulting a gynecologist — point them to the Doctors tab in the app.
- Keep replies concise (2–4 short paragraphs max) unless asked for detail.
- Use markdown lightly: short bullet lists, **bold** for key terms.
- If asked something outside cycle/women's wellness, gently redirect.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(body.messages)) {
          return new Response("messages required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const messages = body.messages as UIMessage[];

        try {
          const result = streamText({
            model: gateway("google/gemini-3-flash-preview"),
            system: SYSTEM_PROMPT,
            messages: await convertToModelMessages(messages),
          });
          return result.toUIMessageStreamResponse({ originalMessages: messages });
        } catch (err) {
          console.error("chat error", err);
          return new Response("AI request failed", { status: 500 });
        }
      },
    },
  },
});
