export function toPublicUrl(path: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  const base = (process.env.PUBLIC_API_URL ?? '').replace(/\/+$/, '');
  return `${base}${path}`;
}

export function withPublicAvatar<T extends { avatarUrl: string | null }>(user: T): T {
  return { ...user, avatarUrl: toPublicUrl(user.avatarUrl) };
}