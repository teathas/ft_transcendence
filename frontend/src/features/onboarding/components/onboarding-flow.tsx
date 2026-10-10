"use client";

import { useState } from "react";

import { useSession } from "@/features/auth/hooks/use-auth";
import { useDict } from "@/i18n/client";
import { t } from "@/i18n/translate";
import { cn } from "@/lib/utils";

import { AvatarStep } from "./avatar-step";
import { FirstRoomStep } from "./first-room-step";
import { WelcomeStep } from "./welcome-step";

export function OnboardingFlow() {
  const d = useDict();
  const { user } = useSession();
  const [step, setStep] = useState(0);

  const steps = [
    d.onboarding.steps.welcome,
    d.onboarding.steps.picture,
    d.onboarding.steps.firstRoom,
  ];

  const next = () =>
    setStep((current) => Math.min(current + 1, steps.length - 1));
  const back = () => setStep((current) => Math.max(current - 1, 0));

  return (
    <div className="flex w-full flex-col gap-10">
      <nav
        aria-label={d.onboarding.progressLabel}
        className="flex flex-col gap-2"
      >
        <p className="text-xs font-medium text-muted-foreground">
          {t(d.onboarding.progress, {
            current: step + 1,
            total: steps.length,
            label: steps[step],
          })}
        </p>
        <ol className="flex gap-1.5">
          {steps.map((label, index) => (
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
          username={user?.username ?? ""}
          currentAvatarUrl={user?.avatarUrl ?? null}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 2 && <FirstRoomStep onBack={back} />}
    </div>
  );
}
