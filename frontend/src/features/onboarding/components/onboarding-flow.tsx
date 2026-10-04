"use client";

import { useState } from "react";

import { useSession } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";

import { AvatarStep } from "./avatar-step";
import { FirstRoomStep } from "./first-room-step";
import { WelcomeStep } from "./welcome-step";

const STEPS = ["Welcome", "Picture", "First room"] as const;

export function OnboardingFlow() {
  const { user } = useSession();
  const [step, setStep] = useState(0);

  const next = () =>
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  const back = () => setStep((current) => Math.max(current - 1, 0));

  return (
    <div className="flex w-full flex-col gap-10">
      <nav aria-label="Progress" className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </p>
        <ol className="flex gap-1.5">
          {STEPS.map((label, index) => (
            <li
              key={label}
              aria-current={index === step ? "step" : undefined}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                index <= step ? "bg-primary" : "bg-muted",
              )}
            >
              <span className="sr-only">{label}</span>
            </li>
          ))}
        </ol>
      </nav>

      {step === 0 && <WelcomeStep username={user?.username} onNext={next} />}

      {step === 1 && (
        <AvatarStep
          username={user?.username ?? "You"}
          currentAvatarUrl={user?.avatarUrl ?? null}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 2 && <FirstRoomStep onBack={back} />}
    </div>
  );
}
