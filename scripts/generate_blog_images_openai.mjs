#!/usr/bin/env node
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Missing OPENAI_API_KEY. Export it and rerun.");
  process.exit(1);
}

const outDir = process.argv[2] || "website/images/blog/generated";
await mkdir(outDir, { recursive: true });

const imageSpecs = [
  {
    id: "itinerary-santa-marta-coast",
    prompt:
      "Cinematic coastal morning in Santa Marta Colombia, palm-lined beach, warm tropical light, natural travel photography style, no people facing camera, high realism, horizontal composition for website hero"
  },
  {
    id: "minca-waterfall-jungle",
    prompt:
      "Lush Minca mountain landscape with waterfall and tropical forest, Colombia Caribbean foothills, realistic travel photo aesthetic, fresh green tones, horizontal hero composition"
  },
  {
    id: "santa-marta-neighborhood-skyline",
    prompt:
      "Santa Marta beachfront skyline at golden hour, modern apartment towers near beach, calm sea and dramatic sky, photorealistic, horizontal composition"
  }
];

const results = [];

for (const spec of imageSpecs) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: spec.prompt,
      size: "1536x1024"
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI image generation failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error(`No b64_json returned for ${spec.id}`);
  }

  const fileName = `${spec.id}.png`;
  const filePath = path.join(outDir, fileName);
  await writeFile(filePath, Buffer.from(b64, "base64"));

  results.push({
    id: spec.id,
    file: fileName,
    prompt: spec.prompt,
    created_at: new Date().toISOString()
  });

  console.log(`Saved ${filePath}`);
}

await writeFile(path.join(outDir, "prompts.json"), JSON.stringify(results, null, 2));
console.log(`Wrote ${path.join(outDir, "prompts.json")}`);
