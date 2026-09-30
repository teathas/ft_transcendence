/**
 * Password strength scoring.
 *
 * Kept as a pure function, separate from any component, so the rules can be
 * read, tested and tuned without touching the UI. This is a hint for the user,
 * not a security control — `registerFormSchema` is what actually gates submit.
 */
export type PasswordCheck = {
  label: string;
  passed: boolean;
};

export type PasswordStrength = {
  /** 0 (nothing) to 4 (every rule satisfied). */
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  checks: PasswordCheck[];
};

const RULES: { label: string; test: (value: string) => boolean }[] = [
  { label: "8+ characters", test: (v) => v.length >= 8 },
  {
    label: "Upper & lowercase",
    test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v),
  },
  { label: "A number", test: (v) => /\d/.test(v) },
  { label: "A symbol", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const LABELS = ["Too weak", "Weak", "Fair", "Good", "Strong"] as const;

export function getPasswordStrength(password: string): PasswordStrength {
  const checks = RULES.map(({ label, test }) => ({
    label,
    passed: password.length > 0 && test(password),
  }));

  const score = checks.filter((check) => check.passed)
    .length as PasswordStrength["score"];

  return { score, label: LABELS[score], checks };
}
