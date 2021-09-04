---
id: part-2
title: Part 2. Reactive programming and RxJS
---

# Reactive programming and RxJS

Contributors:

- Nate Lapinski
- Alain Boudard
- Maina Wycliffe

# Fundamentals of RxJS

## Chapter 2: Reactive Programming with RxJS

- What is declarative programming ?
- What is the Observer pattern, and how does it relate to the Iterator pattern ?

And many others. Along the way, we'll build a very simple Observable of our own, and we'll even touch on a couple of topics from the world of functional programming.

## Chapter Contents:

- Declarative and Imperative programming
- Reactive Programming
- The Iterator and Observer patterns
- arrays as iterables
- iterators as pull
- observers as push
- symmetry between iterators and observers
- Streams of data
- Observables - an implementation of the Observer pattern
- observers
- subscribers
- subscriptions and subjects
- Operators - composition with Observables
- map and filter
- pipelines: the flow of data through an observable. Transducers.

## Declarative and Imperative Programming

The difference between these two styles of programming is perhaps best illustrated with an example.

**Challenge: Write a program which takes the array `x = [1,2,3,4,5]`, and produces a new array, `y`, by adding one to each element in `x`. The result should be `[2,3,4,5,6]`.**

**Solution 1: Use a loop**

```ts
let x = [1, 2, 3, 4, 5];
let y = [];

for (let i = 0; i < x.length; i++) {
  y.push(x[i] + 1);
}

console.log(y); // [2,3,4,5,6]
```

**Solution 2: Use map**

```ts
const add1 = (n) => n + 1;
let x = [1, 2, 3, 4, 5];

let y = x.map(add1);

console.log(y); // [2,3,4,5,6]
```

The difference between declarative and imperative programming can be a little subtle at first. **Solution 1** is an example of _imperative programming_, which is usually described as telling the computer exactly how to calculate what we want, step by step. Notice the loop. We are stepping through each and every element of the array x, and saying how to transform it (by adding 1 to it), and then saying how to place it in the array y (by calling y.push). It's a sort of "do step1, then do step2, then do step3…" approach where we explicitly specify everything.

**Solution 2** is an example of declarative programming. Notice how we've shied away from explicit implementation details, and are describing or "declaring" what we want to happen by using the map method from Array.prototype. We're simply stating "Take the array x, apply the function add1 to every element, and give me the results in a new array called y".

Sometimes, this difference can feel like a matter of preference. At the end of the day, both solutions produce the correct answer, and there's certainly nothing wrong with loops (we'll see later on how map can be implemented internally using a loop). However, when we deal with asynchronous programming, we'll see that the declarative solution is preferable. Why is that? Notice a couple of things about our two solutions:

Solution 1 is very clearly **synchronous** (a loop must always be synchronous), and it's not _composable_ (more on this later).

Solution 2 is a little more interesting. x is an array, so we know that this code is synchronous. However, the _concept_ of mapping over something could very well be asynchronous. We haven't really specified any implementation details with the map, just that we want to apply the function add1 to every element inside of the container x. Maybe those elements are all in memory at once (synchronous), or maybe they are arriving over the network over an interval of time (asynchronous). Indeed, we will see that RxJS has its own map operator, whose semantics aren't so far removed from that of Array.prototype.map.

Another thing to note about Solution 2 is that it is _composable_, meaning we could chain or _pipe_ a sequence of operations together. For plain Javascript code, composition is mostly based on the return value of the function : if map() does return a new Array, we can call another function on this result. Composition will be explained in more detail in the section on operators, so don't worry about it right now. The reason it keeps coming up is because composition of operators is one of the things that makes RxJS so powerful. Should you choose to one day venture into the lands of a language like Haskell, you'll see that composition is one of the foundations of functional programming - it's not a concept that's unique to arrays or RxJS.

## Reactive Programming

Reactive Programming is being able to work with an asynchronous stream of data. You can think of this as a pipe, where data is flowing from one end to the other. You can then observe this stream of data and do something with it - react - like apply some business logic as the data flows through the pipe. These data streams can be anything, from HTTP Requests, Mouse and Keyboard events, Data from Sensors, Push Notifications, or anything that can happen. For instance, take a chat application, where two people are having a chat. Whenever a new message arrives, could be in the form of text or a reaction to the previous message, you need to react accordingly and update the UI appropriately.

ReactiveX (Rx), which RxJS is an implementation of, gives you a set of tools to help you compose data streams. These tools are known as _operators_ and can be used to create new data streams, combine, transform, filter, join, handle errors, etc in your data streams.

The main goal of such an approach will be to handle nicely common issues we can have when dealing with asynchronous streams of data, like the callback hell. This expression refers to the callback function used in asynchronous functions like this (the second argument of addEventListener):

```js
document.getElementById('test').addEventListener('click', (event) => {
  console.log(event.target);
});
```

This event listener is producing a stream of values, values emitted over time at each user click, and this stream virtually never completes.

When we will want to deal with other operations, we will have to nest the next calls in each callback function. Not only will it become hard to read, but the error handling will be very complicated if not impossible. In addition, we will have to work with streams of data that never complete (like the click event) and some that do complete (like a timeout or an Ajax call).

```js
document.getElementById('test').addEventListener('click', (event) => {
  console.log(event.target);
  setTimeout(() => {
    $.ajax({ params }).then((res) => {
      // deal with result
    });
  }, 400);
});
```

In this pseudo code, we can see callback being nested, and we see that this will cause issues very soon, like _what happens if user clicks multiple times ?_ or _how do we cancel the operation ?_

In order to deal with these streams of data, RxJs will introduce much more elegant and powerful tools such as Observables that will be discussed in the next section.

## The Iterator and Observer patterns

Iterables - data types that implement the "iterator" interface - are pretty common in Javascript. Perhaps the most common example is the array. Iterables are usually consumed using a `next` method. Consumers of an iteratable tend to pull data from the producer by using the `next` method. The consumer is the one in control of the flow of data.

```js
var arr = ['a', 'b', 'c'];
var iterator = arr.keys();

console.log(iterator.next()); // { value: 0, done: false }
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

Note that the last value has done property set to true, meaning we _pulled_ all data from the iterator.

By contrast, in the observer pattern, the publisher of the data _pushes_ data to its subscribers, so it is in control of the flow of data.

The concept is pretty straightforward. There is an object containing state that will change over time. This is known as the subject in the classical Observer Pattern. All this subject does is accept callback functions from observers, which are objects that want to be notified whenever the subject's state changes. Whenever such a state change happens, the subject loops through all of the observer callbacks, and invokes them with the new state as an argument.

```ts
class Subject {
  constructor() {
    this.callbacks = [];
  }

  subscribe(fn) {
    this.callbacks.push(fn);
  }

  publish(data) {
    this.callbacks.forEach((fn) => fn(data));
  }
}

// usage
const subject = new Subject();
const observer1 = (data) => console.log(`Observer1 received data: ${data}`);

subject.subscribe(observer1);
counter = 0;

setInterval(() => {
  subject.publish(`test data ${++counter}`);
}, 1000);
```

The classic observer pattern has been a staple of web development for many years. However, it provides no way of containerizing events, meaning we can't compose streams out of subject events. Ideally, we'd have some data structure that enables us to do this.

RxJS improves upon this classical observer pattern by introducing a more robust interface for observers, one that supports not just a method for publishing data (onNext), but also methods for notifying observers of errors (onError), as well as when there is no more data to consume (onComplete). Note that by contract, error and complete are exclusive, you either have one OR the other.
In doing this, the RxJS makes the observer pattern symmetric to the iterator pattern, in some sense.

Soon, we'll see how to implement a simple Observable class.

## Streams of Data

We've seen how thinking about Arrays can be useful for understanding operators like map and filter, and composition over containers in general. So it should come as no surprise that they will provide a glimpse into streams.

In the Haskell - functional programming world, a stream is just an infinite list (array). Since Javascript has no native notion of an infinite array, let's think about how one differs from a regular array.

Consider the following, finite array:

```ts
const arr = [1, 2, 3, 4, 5];

arr.map((x) => x + 1); // [2,3,4,5,6]
```

In this case, `arr` is finite. It's declared, and all of its values are in memory at once. We can synchronously iterate over it using Array.prototype.map, to produce a new array (`[2,3,4,5,6]`).

Because this array is finite, we "know" when it ends - it has length of five in this case. We already know that arrays are composable containers, so we can do things like map, filter, flatMap, reduce, etc, over them. How convenient.

But what about an "infinite array" ? Maybe you have an array that you'd like to use to model mouse click events, or mousemover events. How would you ever know when you are finished ? A user could click or move the mouse at any time, so this theoretical array would be infinite in some sense - we could never know when it would end.

And that's not really a problem, we could just listen for events and "push" these new events into some shared array state…

Still, it would be nice to have something a little more appropriate for handling asynchronicity. Like a data structure that is designed to work with potentially asynchronous, potentially infinite stream of data, while offering composable operators (map, filter, and friends). This is where observables shine. They provide us with a useful interface for consuming "infinite" streams of data.

This will all be clearer with a concrete example, so let's build a simple observable.

## Observables - an implementation of the Observer pattern

Here's a simple implementation of an observable class, along with a static 'of'' method.

```ts
class Observable {
  /** Internal implementation detail */
  _subscribe;

  /**
   * @constructor
   * @param {Function} subscribe is the function that is called when the
   * observable is subscribed to. This function is given a subscriber/observer
   * which provides the three methods on the Observer interface:
   * onNext, onError, and onCompleted
   */
  constructor(subscribe) {
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }

  static of(...args) {
    return new Observable((obs) => {
      args.forEach((val) => obs.onNext(val));
      obs.onCompleted();

      return {
        unsubscribe: () => {
          // just make sure none of the original subscriber's methods are never called.
          obs = {
            onNext: () => {},
            onError: () => {},
            onCompleted: () => {},
          };
        },
      };
    });
  }

  // public api for registering an observer
  subscribe(onNext, onError, onCompleted) {
    if (typeof onNext === 'function') {
      return this._subscribe({
        onNext: onNext,
        onError: onError || (() => {}),
        onCompleted: onCompleted || (() => {}),
      });
    } else {
      return this._subscribe(onNext);
    }
  }
}

const obs = Observable.of(1, 2, 3, 4);

obs.subscribe(console.log); // prints 1,2,3,4
```

In this example, we take a pseudo list of values and turn it into a stream of values, this is the of() method. Basically, nothing happens with an Observable until we subscribe to it, the _obs_ object is some blueprint of a stream of values.

**(Note: if keeping this example implementation makes sense, then explain it in more detail)**

## Operators - composition with Observables

Way back in the section on declarative and imperative programming, we talked about Array.prototype's map function. We saw that it lets us apply a function to each element in an array. More generally, a map applies a transformation function (in our example, add1) over some container (in our example, the array x). RxJS has its own map. It's an example of an _operator_. In the case of RxJS, the container is not an array but an observable. Other than that, many of the concepts are similar! ( **Edit: In a more advanced guide, it might be fun to talk about the difference between array's map, which will map over every element before moving to the next operation, and Observables, which iirc are transducers and instead process a single element through each operator in the pipeline before moving on** )
