import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";

import bearHopeful from "@/assets/bear-hopeful.png";
import bearCrying from "@/assets/bear-crying.png";
import bearHappy from "@/assets/bear-happy.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Emu dost, I am really SORRY 🥺" },
      {
        name: "description",
        content:
          "A cute apology for my best friend Emu. Please forgive me!",
      },
      { property: "og:title", content: "Emu dost, I am really SORRY 🥺" },
      {
        property: "og:description",
        content: "I said sorry 300 times already... please?",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApologyApp,
});

type Screen = "ask" | "celebrate";

const FORMSPREE_URL = "https://formspree.io/f/mljdwlez";

const HEADERS = [
  "Emu dost, I am really SORRY. Please forgive me! 🥺",
  "Are you sure? Please forgive me! 🥺",
  "Pretty please? I'm really, really sorry! 😭",
  "Look how much you made me cry! 😭💔",
];

const SUBTITLES = [
  "I said sorry 300 times already... please?",
  "Just one little click and we're good again 🥹",
  "I'll buy you snacks, I promise! 🍜🍰",
  "My tears are flooding the room now 😭💧💧",
];

function ApologyApp() {
  const [screen, setScreen] = useState<Screen>("ask");
  const [noClicks, setNoClicks] = useState(0);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const buttonZoneRef = useRef<HTMLDivElement>(null);
  const yesRef = useRef<HTMLButtonElement>(null);

  const stage = Math.min(noClicks, 3);
  const crying = noClicks >= 3;

  // Yes button grows with each "No" (font/padding keep it in flow so it
  // never overlaps/ covers the No button).
  const yesSizeClass = [
    "text-lg px-8 py-3",
    "text-xl px-10 py-4",
    "text-2xl px-12 py-5",
    "text-3xl px-14 py-6",
  ][stage];

  const header = HEADERS[stage];
  const subtitle = SUBTITLES[stage];

  function handleNoClick() {
    setNoClicks((n) => n + 1);
    if (buttonZoneRef.current) {
      moveNoAway();
    }
  }

  function moveNoAway() {
    const zone = buttonZoneRef.current;
    if (!zone) return;
    const zr = zone.getBoundingClientRect();
    const noW = 104;
    const noH = 40;
    const margin = 6;
    // Candidate anchors around the perimeter so No always has room and
    // stays reachable (never hides under the Yes button).
    const cands = [
      { x: margin, y: margin },
      { x: zr.width - noW - margin, y: margin },
      { x: margin, y: zr.height - noH - margin },
      { x: zr.width - noW - margin, y: zr.height - noH - margin },
      { x: zr.width / 2 - noW / 2, y: margin },
      { x: zr.width / 2 - noW / 2, y: zr.height - noH - margin },
    ];
    const yesRect = yesRef.current?.getBoundingClientRect();
    const overlapsYes = (x: number, y: number) => {
      if (!yesRect) return false;
      const pad = 12;
      const nx0 = zr.left + x;
      const ny0 = zr.top + y;
      const nx1 = nx0 + noW;
      const ny1 = ny0 + noH;
      return !(
        nx1 < yesRect.left + pad ||
        nx0 > yesRect.right - pad ||
        ny1 < yesRect.top + pad ||
        ny0 > yesRect.bottom - pad
      );
    };
    const pool = cands.filter((c) => !overlapsYes(c.x, c.y));
    const choices = pool.length ? pool : cands;
    const pick = choices[Math.floor(Math.random() * choices.length)];
    const jitter = (range: number) => Math.random() * range * 2 - range;
    setNoPos({
      x: Math.max(
        margin,
        Math.min(pick.x + jitter(20), zr.width - noW - margin)
      ),
      y: Math.max(
        margin,
        Math.min(pick.y + jitter(10), zr.height - noH - margin)
      ),
    });
  }

  function handleNoHover() {
    if (noClicks >= 3) {
      moveNoAway();
    }
  }

  async function notifyFormspree() {
    try {
      await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          response: "Emu clicked YES and forgave you!",
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // Silent: the apology shouldn't break if the network hiccups.
    }
  }

  function fireConfetti() {
    const colors = ["#ff6b9d", "#ffd166", "#06d6a0", "#7b5cff", "#ff8fab"];

    // Big central burst.
    confetti({
      particleCount: 200,
      spread: 110,
      startVelocity: 48,
      origin: { y: 0.6 },
      colors,
    });

    // Side cannons for a few seconds.
    const duration = 2600;
    const end = Date.now() + duration;
    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    // Sparkly rain on top.
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 160,
        startVelocity: 30,
        scalar: 0.8,
        shapes: ["circle"],
        colors,
        origin: { y: 0 },
      });
    }, 350);
  }

  function handleYesClick() {
    notifyFormspree();
    fireConfetti();
    // Small delay so the confetti is already flying when screen swaps.
    setTimeout(() => setScreen("celebrate"), 150);
  }

  if (screen === "celebrate") {
    return <CelebrateScreen />;
  }

  return (
    <main className="app-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-10">
      <FloatingHearts />

      <section className="screen-enter relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        {/* Sticker */}
        <div className="mb-2 flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
          <img
            src={crying ? bearCrying : bearHopeful}
            alt={crying ? "Bear crying" : "Bear hoping to be forgiven"}
            width={256}
            height={256}
            className={`h-full w-full object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.18)] ${
              crying ? "wiggle-cry" : "wiggle"
            }`}
            draggable={false}
          />
        </div>

        {/* Header */}
        <h1
          key={header}
          className="screen-enter text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
        >
          {header}
        </h1>

        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          {subtitle}
        </p>

        {/* Counter hint */}
        {noClicks > 0 && noClicks < 3 && (
          <p className="mt-2 text-sm font-medium text-blush">
            You said no {noClicks} time{noClicks > 1 ? "s" : ""}… 🥺
          </p>
        )}
        {noClicks >= 3 && (
          <p className="mt-2 text-sm font-semibold text-destructive">
            The "No" button is now terrified of your cursor 👀
          </p>
        )}

        {/* Buttons */}
        <div
          ref={buttonZoneRef}
          className="relative mt-9 flex min-h-[230px] w-full flex-wrap items-center justify-center gap-6"
        >
          {/* Yes button — grows as guilt grows */}
          <button
            ref={yesRef}
            onClick={handleYesClick}
            className={`press pulse-ring btn-yes-glow relative z-20 inline-flex items-center gap-2 rounded-full bg-yes font-bold text-yes-foreground ${yesSizeClass}`}
          >
            Yes, I forgive you 💚
          </button>

          {/* No button — runs away after stage 3 */}
          {noClicks < 3 ? (
            <button
              onClick={handleNoClick}
              className="press z-10 inline-flex items-center gap-2 rounded-full border-2 border-no bg-no px-7 py-3 text-base font-semibold text-no-foreground hover:brightness-95"
            >
              No 😤
            </button>
          ) : (
            <button
              onClick={handleNoClick}
              onMouseEnter={handleNoHover}
              style={
                noPos
                  ? {
                      position: "absolute",
                      left: noPos.x,
                      top: noPos.y,
                      transform: "scale(0.85)",
                    }
                  : { position: "absolute", right: "3%", top: "4%" }
              }
              className="runaway press z-10 inline-flex items-center gap-2 rounded-full border-2 border-no bg-no px-6 py-2.5 text-sm font-semibold text-no-foreground"
            >
              No 😰
            </button>
          )}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Made with ❤️ just for you, Emu.
        </p>
      </section>
    </main>
  );
}

function CelebrateScreen() {
  // A little extra confetti when the happy screen appears.
  useEffect(() => {
    const colors = ["#ff6b9d", "#ffd166", "#06d6a0", "#7b5cff", "#ff8fab"];
    const id = setInterval(() => {
      confetti({
        particleCount: 5,
        angle: 90,
        spread: 60,
        startVelocity: 25,
        origin: { x: Math.random(), y: -0.1 },
        colors,
        scalar: 0.8,
      });
    }, 380);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="celebrate-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-10">
      <FloatingHearts count={14} />

      <section className="screen-enter relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        <div className="mb-4 flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80">
          <img
            src={bearHappy}
            alt="Bear celebrating happily"
            width={320}
            height={320}
            className="bounce-happy h-full w-full object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.18)]"
            draggable={false}
          />
        </div>

        <h1 className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-emerald-500 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-6xl">
          YAY! 🎉
        </h1>

        <p className="mt-4 text-2xl font-extrabold text-foreground sm:text-3xl">
          Thank you Emu!
        </p>
        <p className="mt-2 text-xl font-bold text-foreground sm:text-2xl">
          Best friends forever! ❤️
        </p>

        <p className="mt-5 max-w-md text-base text-muted-foreground">
          I promise to be the bestest friend ever. No more making my Emu
          upset… pinky promise! 🤙💖
        </p>

        <a
          href="https://formspree.io"
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none hidden"
        >
          .
        </a>
      </section>
    </main>
  );
}

/** Drifting hearts in the background. */
function FloatingHearts({ count = 9 }: { count?: number }) {
  const hearts = useMemo(() => {
    const emojis = ["💖", "💕", "💗", "💞", "🩷", "✨", "🧸"];
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      left: Math.random() * 100,
      duration: 7 + Math.random() * 8,
      delay: Math.random() * 6,
      size: 18 + Math.random() * 26,
    }));
  }, [count]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {hearts.map((h) => (
        <span
          key={h.id}
          className="float-heart"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}
