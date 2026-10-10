/**
 * Password strength scoring.
 *
 * Kept as a pure function, separate from any component, so the rules can be
 * read, tested and tuned without touching the UI. This is a hint for the user,
 * not a security control — `registerFormSchema` is what actually gates submit.
 *
 * It returns rule *ids*, never wording: the meter looks each one up in the
 * dictionary, so the rules stay language-agnostic.
 */
export type PasswordRuleId = "length" | "letterCase" | "number" | "symbol";

export type PasswordCheck = {
  id: PasswordRuleId;
  passed: boolean;
};

export type PasswordStrength = {
  /** 0 (nothing) to 4 (every rule satisfied). */
  score: 0 | 1 | 2 | 3 | 4;
  checks: PasswordCheck[];
};

const RULES: { id: PasswordRuleId; test: (value: string) => boolean }[] = [
  { id: "length", test: (v) => v.length >= 8 },
  { id: "letterCase", test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { id: "number", test: (v) => /\d/.test(v) },
  { id: "symbol", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export function getPasswordStrength(password: string): PasswordStrength {
  const checks = RULES.map(({ id, test }) => ({
    id,
    passed: password.length > 0 && test(password),
  }));

  const score = checks.filter((check) => check.passed)
    .length as PasswordStrength["score"];

  return { score, checks };
}
