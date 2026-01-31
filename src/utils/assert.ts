export function invariant(
  condition: unknown,
  message: string = "Invariant violation",
): asserts condition {
  if (!condition) throw new Error(message);
}

export function assertUnreachable(value: never): never {
  throw new Error(`Unreachable value: ${String(value)}`);
}

