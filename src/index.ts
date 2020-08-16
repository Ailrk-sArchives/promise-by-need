type PromiseExecutor<T> = (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void;

export class LazyPromise<T> extends Promise<T> {

  [Symbol.toStringTag]: 'LazyPromise';
  _executor: PromiseExecutor<T>;
  _promise?: Promise<T>;

  constructor(executor: PromiseExecutor<T>) {
    try {
      super(resolve => resolve());
    } catch (_) {
    }
    Object.setPrototypeOf(this, LazyPromise.prototype);
    this._executor = executor;
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
  ): Promise<TResult1 | TResult2> {
    this._promise = this.load();
    return this._promise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null,
  ): Promise<T | TResult> {
    this._promise = this.load();
    return this._promise.catch(onrejected);
  }

  finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    this._promise = this.load();
    return this._promise.finally(onfinally);
  }

  static resolve<T>(): Promise<void>;
  static resolve<T>(value: T | PromiseLike<T>): LazyPromise<T>;
  static resolve<T>(value?: T | PromiseLike<T>): LazyPromise<T> | Promise<void> {
    if (value === undefined) {
      return Promise.resolve();
    }
    return new LazyPromise<T>(resolve => resolve(value));
  }

  static from<T>(fn: () => Promise<T>) {
    return new LazyPromise<T>(
      async resolve => {
        resolve(fn());
      }
    );
  }

  private load() {
    return this._promise ?? new Promise(this._executor);
  }
}
