"use client";

import { useState, useRef } from "react";

const SHOT_TYPES = [
  "Close-up",
  "Medium shot",
  "Wide shot",
  "Over the shoulder",
  "POV",
  "Tracking shot",
  "Aerial",
  "Dutch angle",
];

const MOODS = [
  "Tense & suspenseful",
  "Melancholic & quiet",
  "Euphoric & electric",
  "Raw & visceral",
  "Dreamlike & surreal",
  "Cold & clinical",
  "Desperate & urgent",
  "Intimate & tender",
];

export default function Home() {
  const [characters, setCharacters] = useState("");
  const [scene, setScene] = useState("");
  const [mood, setMood] = useState("");
  const [shotType, setShotType] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const generate = async () => {
    if (!characters || !scene || !mood || !shotType) return;
    setLoading(true);
    setOutput("");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ characters, scene, mood, shotType }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      setOutput((prev) => prev + decoder.decode(value));
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    }

    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e8e4dc] font-mono">
      <header className="border-b border-[#1f1f1f] px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-[#555] tracking-[0.2em] uppercase mb-1">
            Reverse engineered from
          </div>
          <h1 className="text-lg font-bold tracking-tight">
            Hell Grind Prompt Studio
          </h1>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xs text-[#555]">41,083 prompts analyzed</div>
          <div className="text-xs text-[#555]">Cannes 2025 · $500k budget</div>
        </div>
      </header>

      <div className="border-b border-[#1f1f1f] px-6 py-3 bg-[#0d0d0d]">
        <p className="text-xs text-[#666] max-w-2xl leading-relaxed">
          Higgsfield open-sourced every prompt from their AI feature film. We
          analyzed 41k of them and extracted the exact formula. Paste the output
          into Higgsfield or fal.ai.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-[#555] mb-2">
              Characters
            </label>
            <textarea
              className="w-full bg-[#111] border border-[#222] rounded px-4 py-3 text-sm text-[#e8e4dc] placeholder-[#333] focus:outline-none focus:border-[#444] resize-none h-24 transition-colors"
              placeholder="e.g. A woman in her 30s, leather jacket torn at the shoulder, dried blood on her cheek..."
              value={characters}
              onChange={(e) => setCharacters(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-[#555] mb-2">
              Scene
            </label>
            <textarea
              className="w-full bg-[#111] border border-[#222] rounded px-4 py-3 text-sm text-[#e8e4dc] placeholder-[#333] focus:outline-none focus:border-[#444] resize-none h-24 transition-colors"
              placeholder="e.g. An abandoned warehouse at dusk, shafts of golden light through broken windows, dust particles..."
              value={scene}
              onChange={(e) => setScene(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-[#555] mb-2">
              Mood
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`text-xs px-3 py-2 rounded border transition-all text-left ${
                    mood === m
                      ? "border-[#c8a96e] text-[#c8a96e] bg-[#1a1508]"
                      : "border-[#222] text-[#555] hover:border-[#333] hover:text-[#888]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-[#555] mb-2">
              Shot Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SHOT_TYPES.map((s) => (
                <button
                  key={s}
                  onClick={() => setShotType(s)}
                  className={`text-xs px-3 py-2 rounded border transition-all text-left ${
                    shotType === s
                      ? "border-[#c8a96e] text-[#c8a96e] bg-[#1a1508]"
                      : "border-[#222] text-[#555] hover:border-[#333] hover:text-[#888]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading || !characters || !scene || !mood || !shotType}
            className="w-full py-3 bg-[#c8a96e] text-[#0a0a0a] text-sm font-bold tracking-[0.1em] uppercase rounded hover:bg-[#d4b97e] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Generating..." : "Generate Prompt"}
          </button>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs tracking-[0.15em] uppercase text-[#555]">
              Cinematic Prompt
            </label>
            {output && (
              <button
                onClick={copy}
                className="text-xs text-[#555] hover:text-[#c8a96e] transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>

          <div
            ref={outputRef}
            className="flex-1 min-h-[500px] bg-[#0d0d0d] border border-[#1f1f1f] rounded p-4 overflow-y-auto"
          >
            {!output && !loading && (
              <div className="h-full flex flex-col justify-center items-center text-center space-y-3">
                <div className="text-[#222] text-5xl">◈</div>
                <p className="text-xs text-[#333] max-w-xs leading-relaxed">
                  Fill in the fields and generate a Cannes-grade cinematic
                  prompt built from 41,000 Hell Grind shots
                </p>
              </div>
            )}
            {output && (
              <pre className="text-xs text-[#aaa] leading-relaxed whitespace-pre-wrap font-mono">
                {output}
                {loading && (
                  <span className="inline-block w-1.5 h-3 bg-[#c8a96e] ml-0.5 animate-pulse" />
                )}
              </pre>
            )}
          </div>

          {output && (
            <div className="mt-3 flex gap-2">
              <a
                href="https://higgsfield.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2 border border-[#222] text-xs text-[#555] rounded hover:border-[#333] hover:text-[#888] transition-all"
              >
                Use in Higgsfield →
              </a>
              <a
                href="https://fal.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2 border border-[#222] text-xs text-[#555] rounded hover:border-[#333] hover:text-[#888] transition-all"
              >
                Use in fal.ai →
              </a>
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-[#1f1f1f] px-6 py-4 mt-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-xs text-[#333]">
            Built by reverse-engineering Higgsfield&apos;s public Hell Grind archive
          </p>
          <p className="text-xs text-[#333]">115,446 generation records</p>
        </div>
      </footer>
    </main>
  );
}
