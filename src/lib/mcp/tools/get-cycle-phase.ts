import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { computeInsights, type CycleProfile } from "@/lib/cycle";

export default defineTool({
  name: "get_cycle_phase",
  title: "Get cycle phase",
  description:
    "Compute the current menstrual cycle phase, day of cycle, next period date, and fertile window from a last-period-start date and cycle length. Pure computation — no user data is stored.",
  inputSchema: {
    lastPeriodStart: z
      .string()
      .describe("ISO date (YYYY-MM-DD) of the first day of the most recent period."),
    cycleLength: z
      .number()
      .int()
      .describe("Average cycle length in days (typical 21-35, default 28)."),
    periodLength: z
      .number()
      .int()
      .describe("Average period length in days (typical 3-7, default 5)."),
    today: z
      .string()
      .optional()
      .describe("Optional ISO date to compute for (defaults to today)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ lastPeriodStart, cycleLength, periodLength, today }) => {
    const profile: CycleProfile = {
      nickname: "",
      lastPeriodStart,
      cycleLength,
      periodLength,
    };
    const insight = computeInsights(profile, today ? new Date(today) : new Date());
    return {
      content: [{ type: "text", text: JSON.stringify(insight, null, 2) }],
      structuredContent: { insight },
    };
  },
});
