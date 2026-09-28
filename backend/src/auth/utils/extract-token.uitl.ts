import { Request } from 'express';

export function extractBearerToken(request: { headers: { authorization?: string } }): string | undefined {
  const authHeader = request.headers.authorization;
  if (!authHeader) return undefined;

  const [type, token] = authHeader.split(' ');
  return type === 'Bearer' ? token : undefined;
}