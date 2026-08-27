import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";



const HELL_GRIND_FOUNDATION = `Style: 8K IMAX. Photorealistic — no 3D render, no game engine, no game-cutscene aesthetic.
Cinematography: Emmanuel Lubezki × Roger Deakins.
Camera: Physical cine lens. 180° shutter motion blur.
Lighting: Natural light only — contre-jour backlight, camera on shadow side, atmospheric haze throughout. Key light from sky and windows only.
Color: 60:30:10 — dominant / secondary / accent.
Skin: Pore-level realism — vellus hair, asymmetric moles, capillary flush, pore-shadow matching on-set light.
Physics: Gravity and inertia respected — mass has real weight, correct contact shadows. No floating props.
Acting: Hollywood — micro-pauses before reactions, precise eye-line, wet living eyes with catch-lights, visible breath and chest rise.
Composition: Rule of thirds + golden ratio. Every person moving from frame one.
Continuity: Characters, props, environment identical across every cut. No identity drift.
Technical: 24fps smooth motion. 8K detail. No jitter.
Audio: Environmental SFX only. No music. No subtitles.`;

export async function POST(req: NextRequest) {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const { characters, scene, mood, shotType } = await req.json();

  const systemPrompt = `You are a cinematic AI prompt engineer. You reverse-engineered the full production playbook from Higgsfield's $500k AI feature film "Hell Grind" — screened at Cannes, covered by WSJ and BBC.

You generate prompts using their exact 7-section shot structure, followed by their 12-line technical foundation. Every output should feel like a $500k film shot, not a YouTube tutorial.

The 7 sections are:
1. CHARACTER CURRENT STATE — current injuries, clothing condition, emotional state
2. SCENE: CONTINUATION — what state this shot picks up from
3. SHOT INTENT — director's intent, what this shot is about
4. GEOMETRY: STAGING — who is where, distance, direction
5. DIALOGUE & SOUND FX — even silent shots need wind and footsteps detailed
6. ACTION + 6 BEATS — 15 seconds split into 6 beats, one sentence each
7. KEY RULES — what must be there, what must never appear

Always end with the technical foundation block verbatim.

Output ONLY the prompt. No explanation, no preamble, no markdown fencing.`;

  const userPrompt = `Generate a cinematic AI video prompt for:
Characters: ${characters}
Scene: ${scene}
Mood/Vibe: ${mood}
Shot type: ${shotType}

Use the full 7-section Hell Grind structure. End with this exact technical foundation:

${HELL_GRIND_FOUNDATION}`;

  const stream = await client.chat.completions.create({
  model: "llama3-70b-8192"
    max_tokens: 1000,
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || "";
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
