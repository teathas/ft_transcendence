export function toFriendPair(a: string, b: string) {
	return a < b ? { lowId: a, highId: b } : { lowId: b, highId: a};
}