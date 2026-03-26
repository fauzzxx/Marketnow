export function describeButton(rawText: string): string | null {
  const text = (rawText || "").replace(/\s+/g, " ").trim();
  if (!text) return null;

  // Exact/common labels
  const map: Record<string, string> = {
    "Get Your Free SEO Audit": "Opens the dashboard to run an SEO audit and get actionable fixes.",
    "Check Your Rankings": "Opens the dashboard to check rankings and visibility signals.",
    "Check SEO": "Opens the dashboard to run the SEO checker workflow.",
    "Get Full AI Analysis": "Opens the dashboard for AI-powered recommendations and fixes.",
    "Fix All Issues with AI": "Opens the dashboard to generate AI fixes for detected issues.",
    "Get Started Now": "Opens the dashboard to start using the platform.",
    "View Pricing": "Opens the dashboard pricing flow (demo route).",
    "Scan Local Grid": "Checks Google Business listing signals for the entity and location.",
    "Initialize Script Generation": "Generates a full YouTube script package (title, hook, script, description, tags).",
    "Initialize Full Audit": "Runs a full site audit (title + meta description extraction).",
    "Analyze Density": "Counts keyword frequency for the given URL content.",
    "Approve & Broadcast": "Publishes the generated post to LinkedIn using automation.",
    "Generate again": "Regenerates content with the same prompt/idea.",
    "Edit yourself": "Lets you manually edit the generated content before publishing or copying.",
    "AI Augmentation": "Refines the generated content based on your feedback.",
  };

  if (map[text]) return map[text];

  // Fallback: generic but helpful
  return `Runs: ${text}.`;
}

