"use client";

import { useEffect, useRef, useState } from "react";

const N = 18;

export function Snake() {
  const canvasRef = useRef(null);
  const state = useRef(null);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("ready"); // ready | playing | over

  const reset = () => {
    state.current = { snake: [[9, 9], [8, 9], [7, 9]], dir: [1, 0], next: [1, 0], food: [13, 9] };
    setScore(0);
    setStatus("playing");
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    const css = getComputedStyle(document.documentElement);
    const draw = () => {
      const c = canvasRef.current;
      const s = c.width / N;
      ctx.clearRect(0, 0, c.width, c.height);
      const st = state.current;
      if (!st) return;
      ctx.fillStyle = "#e8916a";
      ctx.beginPath();
      ctx.arc((st.food[0] + 0.5) * s, (st.food[1] + 0.5) * s, s * 0.38, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = css.getPropertyValue("--green").trim() || "#336b4b";
      st.snake.forEach(([x, y]) => ctx.fillRect(x * s + 1, y * s + 1, s - 2, s - 2));
    };
    draw();
    if (status !== "playing") return;
    const id = setInterval(() => {
      const st = state.current;
      st.dir = st.next;
      const head = [st.snake[0][0] + st.dir[0], st.snake[0][1] + st.dir[1]];
      if (head[0] < 0 || head[1] < 0 || head[0] >= N || head[1] >= N || st.snake.some(([x, y]) => x === head[0] && y === head[1])) {
        setStatus("over");
        return;
      }
      st.snake.unshift(head);
      if (head[0] === st.food[0] && head[1] === st.food[1]) {
        setScore((v) => v + 1);
        do st.food = [Math.floor(Math.random() * N), Math.floor(Math.random() * N)];
        while (st.snake.some(([x, y]) => x === st.food[0] && y === st.food[1]));
      } else st.snake.pop();
      draw();
    }, 110);
    return () => clearInterval(id);
  }, [status]);

  const turn = (d) => {
    const st = state.current;
    if (!st || (d[0] === -st.dir[0] && d[1] === -st.dir[1])) return;
    st.next = d;
  };

  useEffect(() => {
    const map = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
    const onKey = (e) => {
      if (status !== "playing" || !map[e.key]) return;
      e.preventDefault();
      turn(map[e.key]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status]);

  const touch = useRef(null);
  return (
    <div className="game-card">
      <h2>Snake</h2>
      <p className="meta">Arrow keys / WASD, or swipe. Score: {score}</p>
      <canvas
        ref={canvasRef}
        width={360}
        height={360}
        className="snake"
        onTouchStart={(e) => (touch.current = [e.touches[0].clientX, e.touches[0].clientY])}
        onTouchEnd={(e) => {
          if (!touch.current) return;
          const dx = e.changedTouches[0].clientX - touch.current[0];
          const dy = e.changedTouches[0].clientY - touch.current[1];
          if (Math.abs(dx) > Math.abs(dy)) turn([Math.sign(dx), 0]);
          else turn([0, Math.sign(dy)]);
        }}
      />
      <div className="tool-bar">
        <button className="btn btn-primary" onClick={reset}>
          {status === "ready" ? "Start" : status === "over" ? "Play again" : "Restart"}
        </button>
        {status === "over" && <span className="meta">Game over · {score} points</span>}
      </div>
    </div>
  );
}

const EMOJI = ["🚀", "⚡", "🧩", "🎯", "🛠️", "💡", "🔥", "🌱"];
const shuffle = () =>
  [...EMOJI, ...EMOJI]
    .map((v) => ({ v, k: Math.random() }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.v);

export function Memory() {
  const [cards, setCards] = useState(() => EMOJI.concat(EMOJI));
  const [open, setOpen] = useState([]);
  const [done, setDone] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => setCards(shuffle()), []);

  const flip = (i) => {
    if (open.length === 2 || open.includes(i) || done.includes(i)) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      setTimeout(() => {
        if (cards[a] === cards[b]) setDone((d) => [...d, a, b]);
        setOpen([]);
      }, 650);
    }
  };

  const restart = () => {
    setCards(shuffle());
    setOpen([]);
    setDone([]);
    setMoves(0);
  };

  return (
    <div className="game-card">
      <h2>Memory Match</h2>
      <p className="meta">
        Moves: {moves} {done.length === cards.length && "· You won! 🎉"}
      </p>
      <div className="mem">
        {cards.map((c, i) => {
          const shown = open.includes(i) || done.includes(i);
          return (
            <button key={i} className={done.includes(i) ? "done" : shown ? "open" : ""} onClick={() => flip(i)} aria-label={shown ? c : "Hidden card"}>
              {shown ? c : ""}
            </button>
          );
        })}
      </div>
      <div className="tool-bar">
        <button className="btn btn-primary" onClick={restart}>
          New game
        </button>
      </div>
    </div>
  );
}
