import {LazyPromise} from '../src/index';

it("from should resolve lazily", async () => {
  let called = false;
  const f = async () => {
    called = true;
    return 1;
  }
  const p = LazyPromise.from(f);
  expect(called).toBe(false);
  await p;
  expect(called).toBe(true);
});


it("then", async () => {
  let state = false;
  const p = new LazyPromise<number>(resolve => {
    state = true;
    resolve(1);
  });
  expect(state).toBe(false);
  await p;
  expect(state).toBe(true);
});

it("catch", async () => {
  let state = false;
  const p = new LazyPromise((_, reject) => {
    state = true;
    reject("bad");
  })
  expect(state).toBe(false);
  try {
    await p;
  } catch (err) { }
  expect(state).toBe(true);
