---
id: part-6
title: Part 6. Creational operators
---

# Creational operators

Contributors:

- Chau Tran
- Armen Vardanyan
- Tiep Phan

The following example demonstrates how to manually create an `Observable`:

```ts
const observable = new Observable(function subscribe(observer) {
  const id = setTimeout(() => {
    observer.next("Hello Rxjs");
    observer.complete();
  }, 1000);
  return function unsubscribe() {
    clearTimeout(id);
  };
});
```

Some are probably wondering: "Do we have to remember this syntax to work with `Observable`? `next`, then `complete`, and also `unsubscribe`? This is a little too much of a hassle then". To answer this question, we will start exploring some **Operators** and **Functions** from **RxJS** that are used to create `Observable`.

## Preface

This is a common `Observer` that we'll be using throughout this part. If there is any example that uses a different `Observer`, I'll point it out.

```ts
const observer = {
  next: (val) => console.log('next:', val),
  error: (err) => console.log('error:', err),
  complete: () => console.log('complete'),
};
```

## `of()`

This is a function used to create an `Observable` from any type of value: primitives, Array, Object, Function etc... `of()` accepts all inputs and will `complete` as soon as all have been emitted.

### Primitive

```ts
/**
 * output:
 * - next: 'hello'
 * - complete
 */
of("hello").subscribe(observer);
```

### Object/Array

```ts
/**
 * output:
 * - next: [1, 2, 3]
 * - complete
 */
of([1, 2, 3]).subscribe(observer);

/**
 * output:
 * - next: {foo: 'bar'}
 * - complete
 */
of({ foo: "bar" }).subscribe(observer);
```

### Sequence of values

```ts
/**
 * output:
 * - next: 1
 * - next: 2
 * - next: 3
 * - next: 'hello'
 * - next: 'world'
 * - next: {foo: 'bar'}
 * - next: [4, 5, 6]
 * - complete
 */
of(1, 2, 3, "hello", "world", { foo: "bar" }, [4, 5, 6]).subscribe(observer);
```

`of()` when called with no arguments will `complete` immediately without any `next` notification

```ts
/**
 * output:
 * complete
 */
of().subscribe(observer);
```

## `from()`

`from()`, similar to `of()`, is also a function that creates an `Observable` from some value. However, the difference between `from()` and `of()` is that `from()` only accepts value that is either an `Iterable`, or a `Promise`.

`from()` also `completes` after it emits all values passed in.

> Iterable is value that can be iterated over. For example: an Array, an Object, a Map, a Set, or a String. When you iterate over a String, you'll receive each character in that string.

### Array

```ts
/**
 * output:
 * - next: 1
 * - next: 2
 * - next: 3
 * - complete
 */
from([1, 2, 3]).subscribe(observer);
```

When `from()` receives an `Array`, it emits the items in sequence similarly to `of(1, 2, 3)`.

### String

```ts
/**
 * output:
 * - next: 'h'
 * - next: 'e'
 * - next: 'l'
 * - next: 'l'
 * - next: 'o'
 * - next: ' '
 * - next: 'w'
 * - next: 'o'
 * - next: 'r'
 * - next: 'l'
 * - next: 'd'
 * - complete: 'complete'
 */
from("hello world").subscribe(observer);
```

### Map/Set

```ts
const map = new Map();
map.set(1, "hello");
map.set(2, "bye");

/**
 * output:
 * - next: [1, 'hello']
 * - next: [2, 'bye']
 * - complete
 */
from(map).subscribe(observer);

const set = new Set();
set.add(1);
set.add(2);

/**
 * output:
 * - next: 1
 * - next: 2
 * - complete
 */
from(set).subscribe(observer);
```

### Promise

```ts
/**
 * ouput:
 * - next: 'hello world'
 * - complete
 */
from(Promise.resolve("hello world")).subscribe(observer);
```

In a case of a `Promise`, `from()` will unwrap the `Promise` and `next` the `resolved` value (or `error` the `rejected`). This is also the _official_ way to convert a `Promise` to an `Observable.

## `fromEvent()`

`fromEvent()` is used to convert an `Event` to an `Observable`. For example, `DOM Event` like a mouse click or typing in an Input.

```ts
const btn = document.querySelector("#btn");
const input = document.querySelector("#input");

/**
 * output:
 * - next: MouseEvent { ... }
 */
fromEvent(btn, "click").subscribe(observer);

/**
 * output:
 * - next: KeyboardEvent { ... }
 */
fromEvent(input, "keydown").subscribe(observer);
```

Notice that `fromEvent()` creates an `Observable` that does not `complete` after emission. This makes total sense because for events like `click` or `keydown`, we would want to keep listening to these events for as long as we need to. In other words, for as long as these DOM Elements are presented to the consumers. `fromEvent()` cannot determine on its own when we no longer need to listen to these events. This also means that we will need to `unsubscribe` from these `Observable` manually to avoid **memory-leak**.

## `fromEventPattern()`

`fromEventPattern()` is a _low-level_ version of `fromEvent()`. Conceptually, it is similar to `fromEvent()` that is to create `Observable` from events. However, the usage is quite different. `fromEventPattern()` is used to convert _unconventional_ or _callback-based_ Events to `Observable`. To understand this better, let's look at some example:

```ts
/**
 * output:
 * - next: MouseEvent {...}
 */
fromEvent(btn, "click").subscribe(observer);

/**
 * output:
 * - next: MouseEvent {...}
 */
fromEventPattern(
  (handler) => {
    btn.addEventListener("click", handler);
  },
  (handler) => {
    btn.removeEventListener("click", handler);
  }
).subscribe(observer);
```

Another example:

```ts
/**
 * output:
 * - next: 10 10
 */
fromEvent(btn, "click")
  .pipe(map((ev: MouseEvent) => ev.offsetX + " " + ev.offsetY))
  .subscribe(observer);

// fromEventPattern
// In this example, we'll break fromEventPattern() arguments into functions.

function addHandler(handler) {
  btn.addEventListener("click", handler);
}

function removeHandler(handler) {
  btn.removeEventListener("click", handler);
}

/**
 * output:
 * - next: 10 10
 */
fromEventPattern(
  addHandler,
  removeHandler,
  (ev: MouseEvent) => ev.offsetX + " " + ev.offsetY
).subscribe(observer);
```

From these examples, we can tell that `fromEventPattern()` accepts 3 arguments: `addHandler`, `removeHandler`, and an optional `projectFunction`. Moreover, the behavior isn't that much different from `fromEvent()`.

`fromEventPattern()` gives you the ability to convert the Events using their _original_ APIs, like we're using the DOM API such as `addEventListener` and `removeEventListener` to convert the `MouseEvent` to `Observable`. With this knowledge, you can apply `fromEventPattern()` with more complex Event APIs like `SignalR Hub`.

```ts
// _getHub() is an arbitrary function that returns a Hub
const hub = this._getHub(url);

return fromEventPattern(
  (handler) => {
    // open the Websocket
    hub.connection.on(methodName, handler);

    if (hub.refCount === 0) {
      hub.connection.start();
    }

    hub.refCount++;
  },
  (handler) => {
    hub.refCount--;
    // close the Websocket on Unsubscribe
    hub.connection.off(methodName, handler);
    if (hub.refCount === 0) {
      hub.connection.stop();
    }
  }
);
```

or `SocketIO`

```ts
export interface SocketEventMap {
  event1: string;
  event2: number;
}

@Injectable({ providedIn: "root" })
export class SocketService {
  private socket: Socket;

  // init logic

  on<EventName extends keyof SocketEventMap>(
    event: EventName
  ): Observabe<SocketEventMap[EventName]> {
    return fromEventPattern(
      (handler) => {
        this.socket?.on(event, handler);
      },
      (handler) => {
        this.socket?.off(event, handler);
      }
    );
  }
}

// usage
this.socketService.on("event1"); // Observable<string>
this.socketService.on("event2"); // Observable<number>
```

## `fromFetch()`

`fromFetch()` is used to convert `Fetch API` to `Observable`. The usage is identical to that of `fetch()`.

```ts
// Fetch API
fetch("https://jsonplaceholder.typicode.com/todos")
  .then((response) => response.json())
  .then((todos) => {
    /*...*/
  });

// fromFetch()
/**
 * output:
 * - next: [{...}, {...}]
 * - complete
 */
fromFetch("https://jsonplaceholder.typicode.com/todos")
  .pipe(switchMap((response) => response.json()))
  .subscribe(observer);
```

The main difference here is that `fetch()` is `Promise` based and is eager. As soon as we invoke `fetch()`, a request will be made. `fromFetch()` converts the request to `Observable` and makes it lazy. The request **will not** be made until we call `.subscribe()` on `fromFetch()`.

But wait, don't we already have `from()` for something like that? There is a _gotcha_.

```ts
from(fetch("https://jsonplaceholder.typicode.com/todos"));
```

Notice that we haven't called `.subscribe()` and the request will still be made. This is because `fetch()` invokes a Promise eagerly as mentioned above.

## `interval()`

`interval()` creates an `Observable` that emits integers from `0` in a specified interval.

```ts
/**
 * output:
 * - (1s) next: 0
 * - (2s) next: 1
 * - (3s) next: 2
 * - ...
 */
interval(1000).subscribe(observer);
```

`interval()` does not `complete` on its own so we will need to `unsubscribe` from `interval()` manually.

## `timer()`

`timer()` has two usages:

- Create an `Observable` that will emit number `0` after a specified **delay**. This usage of `timer()` will allow it to `complete` itself.
- Create an `Observable` that will emit integers starting with `0` after a specified **delay**, then will emit each value after a specified **interval**. This sounds similar to `interval()` but there is a slight difference which we will explore in a bit. Because this second usage is like `interval()`, it will not `complete` on its own.

```ts
/**
 * output:
 * - (1s) next: 0
 * - complete
 */
timer(1000).subscribe(observer);

/**
 * output:
 * - (1s) next: 0 (the first delay)
 * - (2s) next: 1 (1s interval)
 * - (3s) next: 2 (1s interval)
 * - ...
 */
timer(1000, 1000).subscribe(observer);
```

So what's this _slight_ difference? We can pass `0` as the first argument to `timer(0, 1000)` and this effectively gives us an `Observable` that emits **right away** then every `1s` after that. `interval()` alone cannot achieve this.

```ts
/**
 * output:
 * - (immediate) next: 0
 * - (1s) next: 1 (1s interval)
 * - (2s) next: 2 (1s interval)
 * - ...
 */
timer(0, 1000).subscribe(observer);
```

## `throwError()`

`throwError()` creates an `Observable` that, instead emits values, will throw an Error upon subscribe.

```ts
/**
 * output:
 * - error: 'an error'
 */
throwError("an error").subscribe(observer);
```

`throwError()` is usually used with operators that requires an `Observable` as return value. Two main use-cases are:

- `catchError()`: After we handle an error from an `Observable`, we can use `throwError()` to forward this error to the next `ErrorHandler`

```ts
obs.pipe(
  catchError((err) => {
    // handle error
    showNotification(err.message);
    // forward the error to the next ErrorHandler
    return throwError(err);
  })
);
```

- `(switch|concat|merge)Map` + `retryWhen()`: This is an advanced use-case which we will explore further in **Higher-order Operator** post. The basic idea is we can use `throwError()` to force `retryWhen()` to occur which will **retry** the `Observable` pipeline.

## `defer()`

This will be the last Creation Function that we will explore in this section, and it is an interesting one. `defer()` accepts an `ObservableFactory` (aka a `Function` that returns an `Observable`) to create a _deferred_ version of the original `Observable`. What's special is that `defer()` will use `ObservableFactory` to create a new `Observable` for every new `Subscriber`. Let's explore in the following example:

```ts
const random$ = of(Math.random()); // create an Observable that emits random number

/**
 * output:
 * - next: 0.4146530439875191
 * - complete
 */
random$.subscribe(observer);
/**
 * output:
 * - next: 0.4146530439875191
 * - complete
 */
random$.subscribe(observer);
/**
 * output:
 * - next: 0.4146530439875191
 * - complete
 */
random$.subscribe(observer);
```

We can see that `of()` returns the same result for all 3 subscribers. Let's try the same thing with `defer()`

```ts
const deferredRandom$ = defer(() => of(Math.random()));

/**
 * output:
 * - next: 0.27312186273281935
 * - complete
 */
deferredRandom$.subscribe(observer);
/**
 * output:
 * - next: 0.7180321390218474
 * - complete
 */
deferredRandom$.subscribe(observer);
/**
 * output:
 * - next: 0.9626312890837065
 * - complete
 */
deferredRandom$.subscribe(observer);
```

With `defer()`, we have 3 different results for 3 different subscribers. How does this help? Imagine you'd need to retry some `Observable` pipeline and at the beginning of this pipeline, you'd have a comparison against a value that can change, `defer()` makes sure that when the pipeline occurs (aka is `subscribed` to), the comparison happens with the latest values.
