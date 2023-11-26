export type Reply<T = unknown> = Promise<T>;
export type TOperation = (args?: unknown) => Reply;
