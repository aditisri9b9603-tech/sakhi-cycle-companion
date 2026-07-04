import { defineMcp } from "@lovable.dev/mcp-js";
import affirmationTool from "./tools/affirmation-of-the-day";
import cyclePhaseTool from "./tools/get-cycle-phase";
import productsTool from "./tools/list-period-products";

export default defineMcp({
  name: "sakhi-cycle-mcp",
  title: "Sakhi Cycle MCP",
  version: "0.1.0",
  instructions:
    "Sakhi Cycle exposes menstrual wellness helpers. Use `get_cycle_phase` to compute the current cycle phase and next period from a last-period date; `affirmation_of_the_day` for the daily affirmation; and `list_period_products` to compare period products.",
  tools: [cyclePhaseTool, affirmationTool, productsTool],
});
