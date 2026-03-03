"use client";

import { useState, useEffect, useCallback } from "react";

interface Step {
  title: string;
  clue: string;
  hints: string[];
  mapUrl?: string;
  mapLabel?: string;
}

const STEPS: Step[] = [
  {
    title: "Starting Point",
    clue: "Head to your first location. Use these coordinates to find where your adventure begins.",
    mapUrl: "https://maps.google.com/?q=41.381753,2.175885",
    mapLabel: "41.381753, 2.175885",
    hints: [],
  },
  {
    title: "For Stefi or Judah",
    clue: "A couple of stores towards Jaume I from your current location will give you the answer.\n\nFill in the blank:\nI _____ You",
    hints: [
      "Look for BAF Art Store nearby.",
      "The store might be gone now — the answer is love.",
    ],
  },
  {
    title: "A Familiar Place",
    clue: "We were here only a couple of years ago. Once there, head towards your next destination.",
    hints: ['Think of "high school" in another language.'],
  },
  {
    title: "Not Straight, Not Curved",
    clue: "You shall continue on to a place that is not straight or curved but ___",
    hints: ["Go to Diagonal and get off."],
  },
  {
    title: "Chasing the Sunset",
    clue: "Exit the tunnels and stroll in the direction of the sunset until you reach our special month, then head towards the north pole.",
    hints: [
      "Exit Diagonal street and continue on it west until you reach a street called August.",
    ],
  },
  {
    title: "The Puzzle",
    clue: "The north pole is closer than it seems with global warming and everything. Find a bench across from a parking lot with a name equal to:\n\nAugust 12 (our anniversary) + X = August _ _",
    hints: [
      "Via Augusta, 23, Sarrià-Sant Gervasi, 08006 Barcelona, Spain\nX = 11",
    ],
  },
  {
    title: "Final Destination",
    clue: "Using our answer X from the previous stop, you should now be able to reach your final destination.\n\n41.395882, 2.1538X",
    hints: ["41.395882, 2.153811 — Herbs Barcelona Las Palmas"],
  },
];

function MapIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function ClueLines({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) =>
        line === "" ? (
          <div key={i} className="h-1" />
        ) : (
          <p
            key={i}
            className={`leading-relaxed ${
              line.includes("___") || line.match(/^\d{2}\.\d+/)
                ? "font-serif text-lg font-semibold text-foreground"
                : "text-foreground/85"
            }`}
          >
            {line}
          </p>
        )
      )}
    </>
  );
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [revealedHints, setRevealedHints] = useState<number[]>(
    new Array(STEPS.length).fill(0)
  );
  const [finished, setFinished] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("scavenger-hunt-state");
      if (saved) {
        const state = JSON.parse(saved);
        setStarted(state.started ?? false);
        setCurrentStep(state.currentStep ?? 0);
        setRevealedHints(
          state.revealedHints ?? new Array(STEPS.length).fill(0)
        );
        setFinished(state.finished ?? false);
      }
    } catch {
      /* ignore */
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(
        "scavenger-hunt-state",
        JSON.stringify({ started, currentStep, revealedHints, finished })
      );
    } catch {
      /* ignore */
    }
  }, [started, currentStep, revealedHints, finished, mounted]);

  const revealHint = useCallback(() => {
    setRevealedHints((prev) => {
      const next = [...prev];
      const step = STEPS[currentStep];
      if (next[currentStep] < step.hints.length) {
        next[currentStep]++;
      }
      return next;
    });
  }, [currentStep]);

  const nextStep = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  }, [currentStep]);

  const resetHunt = useCallback(() => {
    setStarted(false);
    setCurrentStep(0);
    setRevealedHints(new Array(STEPS.length).fill(0));
    setFinished(false);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ---------- START SCREEN ----------
  if (!started) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-2">
            <p className="text-muted text-sm tracking-widest uppercase">
              Barcelona
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight">
              A Scavenger Hunt
            </h1>
            <p className="font-serif text-2xl sm:text-3xl text-accent italic">
              for You
            </p>
          </div>

          <div className="w-12 h-px bg-accent-border mx-auto" />

          <div className="bg-card rounded-2xl p-6 shadow-sm border border-accent-border/50 text-left space-y-3">
            <p className="text-sm font-medium text-muted uppercase tracking-wider">
              Rules
            </p>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#x2022;</span>
                Only use hints if you&apos;re lost
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#x2022;</span>
                Do not skip stops
              </li>
            </ul>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-3.5 px-8 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            Begin Adventure
          </button>
        </div>
      </div>
    );
  }

  // ---------- FINISH SCREEN ----------
  if (finished) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <p className="text-5xl select-none">&#10047;</p>
            <h1 className="font-serif text-4xl font-semibold">You made it!</h1>
            <p className="text-muted text-lg leading-relaxed">
              Now enjoy what&apos;s waiting for you.
            </p>
          </div>

          <button
            onClick={resetHunt}
            className="text-sm text-muted hover:text-foreground underline underline-offset-4 transition-colors cursor-pointer"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  // ---------- STEP SCREEN ----------
  const step = STEPS[currentStep];
  const hintsRevealed = revealedHints[currentStep] || 0;
  const hasMoreHints = hintsRevealed < step.hints.length;
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="min-h-dvh flex flex-col px-6 py-8 max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-muted tracking-wider uppercase">
          Stop {currentStep + 1} of {STEPS.length}
        </p>
        <button
          onClick={resetHunt}
          className="text-xs text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>
      <div className="w-full h-1 bg-accent-light rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Step Content */}
      <div className="flex-1 space-y-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold">
          {step.title}
        </h2>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-accent-border/40 space-y-3">
          <ClueLines text={step.clue} />

          {step.mapUrl && (
            <a
              href={step.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover font-medium transition-colors mt-1"
            >
              <MapIcon />
              {step.mapLabel || "Open in Maps"}
            </a>
          )}
        </div>

        {/* Hints */}
        {step.hints.length > 0 && (
          <div className="space-y-3">
            {Array.from({ length: hintsRevealed }).map((_, i) => (
              <div
                key={i}
                className="bg-hint rounded-xl p-4 border border-accent-border/30 animate-fadeIn"
              >
                <p className="text-xs text-muted font-medium uppercase tracking-wider mb-1">
                  Hint {step.hints.length > 1 ? i + 1 : ""}
                </p>
                {step.hints[i].split("\n").map((line, j) => (
                  <p
                    key={j}
                    className="text-sm text-foreground/80 leading-relaxed"
                  >
                    {line}
                  </p>
                ))}
                {isLastStep && i === step.hints.length - 1 && (
                  <a
                    href="https://maps.google.com/?q=41.395882,2.153811"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover font-medium transition-colors mt-2"
                  >
                    <MapIcon />
                    Open in Maps
                  </a>
                )}
              </div>
            ))}

            {hasMoreHints && (
              <button
                onClick={revealHint}
                className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-accent-border text-muted hover:text-foreground hover:border-accent transition-colors text-sm font-medium cursor-pointer"
              >
                {hintsRevealed === 0 ? "Need a hint?" : "Need another hint?"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Next Button */}
      <div className="pt-8 pb-4">
        <button
          onClick={nextStep}
          className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-3.5 px-8 rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          {isLastStep ? "Complete Hunt" : "Next Stop \u2192"}
        </button>
      </div>
    </div>
  );
}
