import type { PromiseType } from "utility-types";
import type fetch from "node-fetch-commonjs";

export class ShodoApiError extends Error {
  static mark = Symbol();
  mark = ShodoApiError.mark;

  static is(e: any): e is ShodoApiError {
    return e.mark === ShodoApiError.mark;
  }

  constructor(public readonly response: PromiseType<ReturnType<typeof fetch>>) {
    super(`http request to shodo api error`);
  }
}
