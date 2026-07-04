import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const PRODUCTS = [
  {
    id: "pads",
    name: "Sanitary pads",
    bestFor: "Beginners, night use, heavy flow",
    pros: ["Easy to use", "No insertion", "Widely available"],
    cons: ["Can feel bulky", "More waste unless reusable"],
  },
  {
    id: "tampons",
    name: "Tampons",
    bestFor: "Active days, swimming",
    pros: ["Discreet", "Comfortable when in right size"],
    cons: ["Learning curve", "TSS risk if left too long"],
  },
  {
    id: "cup",
    name: "Menstrual cup",
    bestFor: "Long wear, eco-conscious users",
    pros: ["12h wear", "Reusable for years", "Cost effective"],
    cons: ["Insertion learning curve", "Needs sterilizing"],
  },
  {
    id: "disc",
    name: "Menstrual disc",
    bestFor: "Mess-free intimacy, heavy flow",
    pros: ["Highest capacity", "Comfortable"],
    cons: ["Trickier removal", "Higher cost"],
  },
  {
    id: "period-underwear",
    name: "Period underwear",
    bestFor: "Backup, light days, teens",
    pros: ["No insertion", "Reusable", "Comfortable"],
    cons: ["Needs laundry care", "Limited capacity alone"],
  },
];

export default defineTool({
  name: "list_period_products",
  title: "List period products",
  description:
    "List common menstrual products with pros, cons, and who they suit best. Optionally filter by product id.",
  inputSchema: {
    id: z
      .string()
      .optional()
      .describe("Optional product id: pads, tampons, cup, disc, or period-underwear."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const items = id ? PRODUCTS.filter((p) => p.id === id) : PRODUCTS;
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { products: items },
    };
  },
});
