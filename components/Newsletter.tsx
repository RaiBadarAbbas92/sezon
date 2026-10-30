"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Heart } from "./doodles";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState("error");
    setState("done");
  };

  if (state === "done")
    return (
      <p className="inline-flex items-center gap-2 font-hand text-[20px] text-sage-900">
        <Heart size={20} className="text-wood" /> You&apos;re in! Cozy letters coming your way.
      </p>
    );

  return (
    <form onSubmit={submit} noValidate className="w-full max-w-[460px]">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setState("idle");
          }}
          placeholder="your@email.com"
          aria-label="Email address"
          aria-invalid={state === "error"}
          className={`field rounded-pill ${state === "error" ? "field-error" : ""}`}
        />
        <button type="submit" className="btn-primary group shrink-0">
          Join the club <ArrowRight size={18} className="arrow-nudge" />
        </button>
      </div>
      {state === "error" && <p className="mt-2 pl-4 text-[13px] text-terracotta">Please enter a valid email.</p>}
    </form>
  );
}
