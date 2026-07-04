import { defineTool } from "@lovable.dev/mcp-js";
import { affirmationOfDay, AFFIRMATIONS } from "@/lib/cycle";

export default defineTool({
  name: "affirmation_of_the_day",
  title: "Affirmation of the day",
  description: "Return today's Sakhi Cycle affirmation — a short, warm daily message for menstrual wellness.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const text = affirmationOfDay();
    return {
      content: [{ type: "text", text }],
      structuredContent: { affirmation: text, totalCount: AFFIRMATIONS.length },
    };
  },
});
