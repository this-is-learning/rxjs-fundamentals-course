---
id: part-1
title: Part 1. RxJS: better async programming
---

# RxJS: better async programming

Contributors:

- Oleksandr Poshtaruk
- Armen Vardanyan

# Why do we need Observables?

Async operations are the core of today's web development. Almost any interesting interaction in a modern web app involves an async operation. Mouse click? Async. Loading data from the backend? Async. Waiting for something to happen before rendering some piece of UI? Also async. But there are not many powerful built-in tools for implementing working with them. Let's recall some of the native ones:

- setTimeout/setInterval
- Promises
- generator (the \*functions)

And that's it.

Yeah, you may wonder - what about async/await? Well, it turns out, those are just wrappers for Promises, essentially syntactic sugar.

What challenges usually arise with async programming?

Let's review typical async programming issues a developer can encounter:

- Starting one async operation only after a previous async operation is finished - preventing race conditions.
- Repeating failed async operation on error or on successful completion.
- Combining the results of a few async operations results in different ways.
- Recalculating displayed data on each periodical async data update
- Canceling async operations if it is not needed anymore

Now let's find out whether tools listed above can solve these challenges seamlessly.

_a) Starting one after another_

Well, you can do that with `Promise.then.then.then`, but that is useful only for very straightforward logic. Also, if we want to perform some complex calculations on the result of one async operation before starting the next one, the callbacks for the &quot;then&quot; functions will become bloated and less readable very fast.

We can improve the situation using async/await - but what if we want to repeat failed network requests?

We cannot do that with async/await easily.

_b) Combining the results of a few async operations in different ways_
We have Promise.race and Promise.all. Not long ago we got Promise.allSettled (check canIuse before using it)
But again - that's it. No repeat on success or failure (if we want it).

_c) Do displayed data recalculations on each periodical async data update_
Ok. SetTimeout is good here, but it does not provide any complicated failure logic (repeat on failure). It is possible to implement it - but with some code overhead.

_d) Cancel async operations in case it is not needed anymore_
You can cancel setTimeout/setInterval - but you cannot cancel fetch (well, you can with AbortController, but check browser support first (IE11))

But again - _ **combination** _ of async requests result or _ **repeat/retry** _ on error logic implementation remains very challenging.

Do we have a solution?
YES!

Observables from RxJS library.

## What is RxJS

RxJS is a library for reactive programming using `Observables` which make it easier to compose asynchronous or callback-based code. RxJS is the JavaScript implementation of Reactive programming (or the Reactive Extentions - Rx) paradigm.

Reactive programming helps handle ASYNC operations easily by treating those as streams of data.

Data streams are sequences of business logic events.

Examples of such events are:

- Browser events: mouse clicking/moving, input field change, etc.
- REST API data fetching
- Web-component state switching/DOM updates
- Calculated data update
- WebSocket real time data
- The list goes on

The main entity (which wraps our data) from that library is the _ **Observable** _.

## What are Observables?

Short answer: `Observable` is an object that represents a stream of data, to which we can subscribe to receive events/error notifications, and which we can manipulate using special functions called operators.

Long answer: we need to dive a bit deeper.

To understand Observables better let's use some metaphors:

a) Array of future values, which are spreaded over time - this may sound complicated, but if we break it down, it is really simple:

Let's take a usual array - its values are there instantly:

```ts
[1, 2, 3, 4, 5]; // we can access all values at once - they are already there
```

We can transform these values as well:

```ts
[1, 2, 3, 4, 5].map((x) => x + 1); // 2,3,4,5,6
```

This is very similar to `Observables` - the only difference being that for an `Observable` the values are in place now and some of the values will be received later.

`Observable`: [1 <--some time---> 2 <--time→...]

It is important to understand that most values will arrive and be handled later (at the moment of arrival).

[1 <--sometime--->2 <--time→...].pipe(map(x => x+1)) // [2…..3…..etc]

b) Push-based value fetching - what does this mean? In general, we mostly use pull based value fetching in programming. A great example of pull based value fetching are functions: they are there, but we, the consumer of their value, determine when we will call the function to receive and handle the data. On the other hand, for example, a click MouseEvent listener is a push based system - we can never know when the event will be _pushed_ to us - the producer determines when we receive values - but we will handle those values _as soon as_ they arrive.

If we talk about arrays - we get any value when we want it.

```ts
const someArray = [1, 2, 3];
someArray[i];
```

But in the case of `Observables` (where values are delivered in the future), the receiver (which is called subscriber or observer- more about it in the next chapter) cannot control when the producer will emit values.

This approach is called push-based.

So, in the end, an `Observable` is an object representing a stream of values spread over time, delivered via a push based system, which can be subscribed to in order to receive and handle those values, and transformed using special functions called operators.

## Promises **and** Observables

Now let's compare Promises and Observables.

They have some similarities that will help us understand Observables.

The main similarity between them is that both of them represent a result of an async operation and how it is being handled. Both `Promises` and `Observables` operate with data that isn't available right now but will arrive in the future. So what's the main difference then?

The thing is, `Promises` are only one particular case of async operation - a singular operation with a final and conclusive result. What does that mean? Let's take a look at a standard HTTP request - how is it invoked and resolved? Well, we call a URL using one of the HTTP methods, and get a `Promise` that will invoke the callback to the &quot;then&quot; method when data arrives (this is called &quot;resolving a `Promise`&quot;), or, if there has been any kind of error during the request, call the callback provided to the &quot;catch&quot; method (this is called &quot;rejecting a `Promise`&quot;). Okay, so this is an operation that gets (or fails to) some data, handles it and just goes away. We cannot do anything with the `Promise` after it is resolved/rejected - we have to make another HTTP call, create a new `Promise` and handle it again in the same way.

Now, let's take a look at some click events on a button. We start listening to the click events, but there is no guarantee that the callback will be invoked any time soon, right? Now, 5 minutes later the user finally clicks the button, and our callback works and handles the event, but it is not &quot;resolved&quot;. The user can continue clicking on the button as many times as they want, and we would still have to handle that click. And after the user finally goes to another page, we have to stop listening to the clicks, because there is no button any more. We cannot represent a stream of events like clicks with a Promise, because a Promise works once and is destroyed afterwards. But `Observable` Streams of RxJS give us the ability to create streams, listen to their events, handle error cases, and also, handle the situation when the stream completes - like when the user went to another page in our example. So, in this regard, we can treat `Observables` as a far more powerful version of Promises, which deals with multiple events rather than one instance.

![Promise vs. RxJS](/rxjs-fundamentals-course/img/part-1/promise-vs-rxjs.png)

_Image by Andrew Grekov._

Now lets take a closer look.

You may ask - so what is the difference? And why do we need `Observables` at all if they actually do same things?

Let me first answer a second question:

The main power of RxJS is a variation of operators that can emulate any async steam behavior - for example combine streams, repeat streams on success or retry on error, etc - out of the box.

Why operators are so powerful? Because they can do many things:

1. Modify stream data

2. Filter out data you don't need (if duplicate data is emitted or based on a condition)

3. Repeat/retry data emissions on success or on failure (mostly used for HTTP requests wrapped in `Observables`)

4. Combination of steams is also possible not only as `Promise.all` (all resolved) or `Promise.race` (any resolved) but with many more cases:

- Emission of more than one value
- On each value from source1 take last emitted value from source2
- On any emission from source1 or source2 emit array of last values from both
- Etc

For example:

**a) combineLatest**(observable1, observable2,…) — waits for any of observable to emit and provide array of last emitted values from all observables (result: [value\_obs1, value\_obs2,..]). Very good if you should update page on a new data from a few different sources.

**b)** observable1.pipe( **withLatestFrom** (observable2) — on each value from observable1 also provide last emitted value for observable2 (result: [value\_obs1, value\_obs2]).

**c) forkJoin**(observable1, observable2,…)— analog for Promise.all — waits till all Observables are complete and then emits an array of last values from all of the argument observables.

**d)\*\***zip\*\* (observable1, observable2,…)— waits for all of the argument observables to emit values with the same index and provide an array of emitted values with the same index (result: [value\_obs1, value\_obs2,..]).

**e) race**(observable1, observable2,…) — returns an Observable that mirrors the first source Observable to emit an item.

**f) merge**(observable1, observable2,…) — subscribes to every argument observable and re-emits values from all of them.

**g) switchMap** — if previous Observable is not completed — cancel it and subscribe to new one.

**I) concat**(observable1, observable2,…) — start next Observable sequence only after previous one is done (emits values one by one after each specific Observable completion)

And many more ([switchMap](https://rxjs-dev.firebaseapp.com/api/operators/switchMap), mergeMap, [partition](https://rxjs-dev.firebaseapp.com/api/index/function/partition), [iif](https://rxjs-dev.firebaseapp.com/api/index/function/iif), [groupBy](https://rxjs-dev.firebaseapp.com/api/operators/groupBy), [window](https://rxjs-dev.firebaseapp.com/api/operators/window), etc)

We will review some of these combinations and their use-cases in a later chapter. And dig deeper in advanced RxJS course.

> Now lets review the main differences between Promises and Observables you should be aware of (or they will bite you some time later)

### Promises **vs** Observables

At first glance — Observables are just advanced Promises: Promises emits one value and complete (resolve), Observables emit 0, one or many values and complete as well (emit and complete are different actions). For HTTP service in AngularJS (where it used Promises) and Angular (where it uses Observables) provides only one value — so seems both frameworks work very similar in this case.

![](RackMultipart20210318-4-1e6dc56_html_fc59ddf18c80e00b.png)

but if you application is doing something more then 'Hello world' — please pay attention to the differences.

### #1 Eager vs Lazy

Take a look at the example below: ![](RackMultipart20210318-4-1e6dc56_html_533e70b36f8382d3.png)

When I call the `saveChanges` method — the first example with `Promise`-wrapped request will work as expected. But in seconds `Observable`-wrapped example nothing will happen because `Observables` are lazily-evaluated while `Promises` are eagerly-evaluated.

This means that Promises doesn't care whether they have any consumers that wait for their result or not, they will emit the value regardless. But `Observables` (to be precise — _cold_ `Observables`) will emit only if we subscribe to them. In the case above you should subscribe to the `Observable` returned by **saveChanges** function.

```ts
saveChanges(data).subscribe();
```

To keep an eye on it — use _rxjs-no-ignored-observable_ rule from [rxjs-tslint-rules](https://github.com/cartant/rxjs-tslint-rules/blob/master/source/rules/rxjsNoIgnoredObservableRule.ts) by [Nicholas Jamieson](https://medium.com/u/d05557088657?source=post_page-----1161afacef7e----------------------).

### #2 Promises cannot be canceled while Observables can be unsubscribed

Again, start with an example when we do search on a backend on input text change

![](RackMultipart20210318-4-1e6dc56_html_518aba158767f496.png)

There is a drawback here — you cannot reject results of the previous request if the user continues typing (`debounce` make this problem a bit less but doesn't eliminate it). And yet another issue — race conditions are possible (when a later request result will come back faster then an earlier one — so we get an incorrect response displayed).

`Observables` can avoid this concern quite elegantly with [_ **switchMap** _](https://rxjs-dev.firebaseapp.com/api/operators/switchMap) operator

![](RackMultipart20210318-4-1e6dc56_html_f31260205a770974.png)

We will talk about `switchMap` and other higher-order-observable operators in the advanced RxJS course.

### #3 Easy to prevent race conditions with Observables and hard - with Promises.

Say we periodically make a network request for updated data. But in some situations later request results will come back faster than the earlier ones — so we get incorrect (earlier requested) responses displayed as latest.

```ts
getData() {

  this.http$.get('...').then(doSomeRenderingFunc)

}

setTimeout(2000, getData);

setTimeout(2500, getData);

...
```

We expect here that first response will be rendered first and then second one. But in reality, because of network latency, it may be not like that. The second request response can come earlier than the first(old) response data. So the user gets non-appropriate data displayed. This situation is called race-conditions.

To prevent this with Observable-wrapped requests we can use [**concatMap**](https://rxjs-dev.firebaseapp.com/api/operators/concatMap) operator (reviewed in advanced course).

```ts
interval(500).pipe(

concatMap(() = ajax.get('...'))

).subscribe(doSomeRenderingFunc)
```

In that case next request will be done only after the previous one is handled.

> I hope now you've got some vision of what Observables can do. Now lets review where they are used in Angular.

## Angular and RxJS Observables

Angular and RxJS are like a bee and honey. There a lots of places where Angular entities API provides an `Observable`.

For example:

- **Http requests** in Angular are wrapped in `Observables`, which allows us easily implement repeat/retry logic and make parallel or subsequent requests.
- Reactive Forms: **FormControls** has a . **valueChanges** Observable property. Now each time the whole form or some specific field has changed - you will be notified.
- @ **ViewChildren** decorator property has a . **changes** Observable API. Now each time the list is re-rendered by Angular - you will know that.
- **Interceptors** () - allow to implement additional logic for HTTP requests (like refresh tokens)
- **Guards**: can return an `Observable` of a boolean value to check asynchronously if a user can visit a Route
- **Route Resolvers**: do not render a page until the data necessary for it is in place

And many more.

You will dig deeper in a later article.

Hope after reading this article you want to learn more - so lets move on!
