"use client";

import { useMemo, useState } from "react";

const TOOLS = ["JSON formatter", "Base64", "Word counter", "Case converter", "URL encode"];

function toBase64(s) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(s)));
}
function fromBase64(s) {
  return new TextDecoder().decode(Uint8Array.from(atob(s.trim()), (c) => c.charCodeAt(0)));
}

export default function Tools() {
  const [tool, setTool] = useState(TOOLS[0]);
  const [input, setInput] = useState('{"name":"Raj","skills":["Laravel","React"],"available":true}');
  const [output, setOutput] = useState("");
  const [err, setErr] = useState("");

  const run = (fn) => {
    try {
      setErr("");
      setOutput(fn(input));
    } catch (e) {
      setErr(e.message || "Couldn't process that input.");
    }
  };

  const counts = useMemo(() => {
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    return { words, chars: input.length, lines: input ? input.split("\n").length : 0, read: Math.max(1, Math.round(words / 220)) };
  }, [input]);

  const actions = {
    "JSON formatter": [
      ["Format", (s) => JSON.stringify(JSON.parse(s), null, 2)],
      ["Minify", (s) => JSON.stringify(JSON.parse(s))],
    ],
    Base64: [
      ["Encode", toBase64],
      ["Decode", fromBase64],
    ],
    "Case converter": [
      ["UPPER", (s) => s.toUpperCase()],
      ["lower", (s) => s.toLowerCase()],
      ["Title Case", (s) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())],
      ["kebab-case", (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")],
      ["snake_case", (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")],
    ],
    "URL encode": [
      ["Encode", encodeURIComponent],
      ["Decode", decodeURIComponent],
    ],
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <div className="tool-tabs" role="toolbar" aria-label="Choose a tool">
        {TOOLS.map((t) => (
          <button key={t} aria-pressed={tool === t} onClick={() => (setTool(t), setOutput(""), setErr(""))}>
            {t}
          </button>
        ))}
      </div>
      <div className="tool-area">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} aria-label="Input" spellCheck={false} />
        {tool === "Word counter" ? (
          <div className="card" style={{ display: "grid", gap: 8, alignContent: "start" }}>
            <h3>Counts</h3>
            <p>Words: <b>{counts.words}</b></p>
            <p>Characters: <b>{counts.chars}</b></p>
            <p>Lines: <b>{counts.lines}</b></p>
            <p>Reading time: <b>~{counts.read} min</b></p>
          </div>
        ) : (
          <textarea value={output} readOnly aria-label="Output" placeholder="Output appears here" spellCheck={false} />
        )}
      </div>
      {actions[tool] && (
        <div className="tool-bar">
          {actions[tool].map(([label, fn]) => (
            <button key={label} className="btn btn-primary" onClick={() => run(fn)}>
              {label}
            </button>
          ))}
          <button className="btn" onClick={() => navigator.clipboard?.writeText(output)} disabled={!output}>
            Copy output
          </button>
          {err && <span className="tool-err">{err}</span>}
        </div>
      )}
    </div>
  );
}
