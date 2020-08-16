const P = require('./dist/index');

let state = false;
const p = new P.LazyPromise(resolve => {
  state = true;
  resolve(1);
});

console.log(state);

(async () => {
  const c = await p;
  console.log(state);
})();
