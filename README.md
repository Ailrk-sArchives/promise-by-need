# Lazily evaluated promise

It's just like a normal promise, a bit lazier.

```typescript
let state = false;
const p = new LazyPromise<number>(resolve => {
    state = true;
    resolve(1);
});

// at this point `state` is still false.
// if it evaluate eagerly it will be true.
await p;
// `now state is true`
```

There are many lazily evaluated promise library on github, and there implementatin are all sorta the same. This version combined some features between different libraries I find useful.
