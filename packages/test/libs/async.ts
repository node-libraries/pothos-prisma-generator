import { beforeAll, afterAll, it } from "vitest";

class Sync<T> {
  promise: Promise<T>;
  resolve!: (value: T | PromiseLike<T>) => void;
  constructor() {
    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }
  exec(proc: () => Promise<T>) {
    return async () => {
      const result = await proc();
      this.resolve(result);
      return result;
    };
  }
  lock() {
    return this.promise;
  }
}

export const beforeAllAsync = <T>(proc: () => Promise<T>, timeout?: number) => {
  const sync = new Sync<T>();
  beforeAll(sync.exec(proc), timeout);
  return sync.lock();
};

export const afterAllAsync = <T>(proc: () => Promise<T>, timeout?: number) => {
  const sync = new Sync<T>();
  afterAll(sync.exec(proc), timeout);
  return sync.lock();
};

export const testSync = (
  name: string,
  proc: () => void | Promise<void>,
  timeout?: number
) => {
  it(name, proc, timeout);
};
