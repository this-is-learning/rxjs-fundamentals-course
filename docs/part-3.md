---
id: part-3
title: Part 3. The most common RxJS operators
---

# The most common RxJS operators

Contributors:

- Andrew Grekov
- Armen Vardanyan

# **RxJS operators that we use on a daily basis**

# Comment

When we first begin to work with **RxJS**, we need to learn about several operators that we will be using all the time. In this part of the course we will learn about the most common operators and also use them in practice.

# **Changing values in a stream**

## **from()**

To start working with **RxJS** streams, we will use **from()** to create some `Observables`.

**from()** creates a stream from items of an iterable value. For example, if we pass an `Array`, it will create a stream with items from it.

```ts
import { from } from "rxjs";

const source = from([1, 2, 3]);

// Will log:

//. 1

//. 2

//. 3

source.subscribe((value) => console.log(value));
```

As seen in the example, **from()** creates a stream of values from its argument.

## **map()**

Creating a stream is cool and fun, but it would be even more awesome if we learn to change values in that stream. For example, let's multiply every number in a stream by 2. For that purpose we can use the **map()** operator.

**map()** works on every item in the stream one-by-one. It is fully analogous to **Array.prototype.map**, just for streams.

```ts
import { from } from "rxjs";

import { map } from "rxjs/operators";

const source = from([1, 2, 3]).pipe(
  // multiply every value by 2

  map((value) => value * 2)
);

// Will log:

//. 2

//. 4

//. 6

source.subscribe((value) => console.log(value));
```

As seen from this example, **map()** allows us to receive every item, change it, and return it back to the stream.

#

# **Filtering items in a stream**

## **filter()**

Sometimes we are facing a task, when we do not want some items from the stream to pass forward. For example, we want only even numbers to pass. For that purpose, we use the **filter()** operator.

**filter()** operator filters items of the stream based on a condition provided by a callback function, which receives every item, and returns a boolean indicating whether that value should or should not pass (such functions are usually called predicates). This is fully analogous to **Array.prototype.filter**, but for streams.

```ts
import { from } from "rxjs";

import { filter } from "rxjs/operators";

const source = from([1, 2, 3, 4]).pipe(
  // Check if the value is even

  filter((value) => value % 2 === 0)
);

// Will log:

//. 2

//. 4

source.subscribe((value) => console.log(value));
```

As seen from the example, **filter()** allows us to filter values, and decide if we want a particular value to pass or not.

## **skip(), first(), take()**

Sometimes we need to skip several values, or, on the contrary, only work on the first few. Let's see how we can do that using the **filter()** operator.

```ts
import { from } from "rxjs";

import { filter } from "rxjs/operators";

const source = from([1, 2, 3]).pipe(
  // Will skip the first value and return the next

  filter((value, index) => index > 0)
);

// Will log:

//. 2

//. 3

source.subscribe((value) => console.log(value));
```

**RxJS** provides us with built-in operators for such tasks. Let's see the **skip()** operator in action and rewrite the code above:

**skip()** operator allows us to skip several values from the start of the stream.

```ts
import { from } from "rxjs";

import { skip } from "rxjs/operators";

const source = from([1, 2, 3]).pipe(
  // Will skip the first value and let every other value after that to pas

  skip(1)
);

// Will log:

//. 2

//. 3

source.subscribe((value) => console.log(value));
```

We replaced **filter()** with **skip()**, which made our code more readable and understandable. Now our code looks more declarative.

Now let's do the opposite, that is, take only the first several values from a stream, and ignore the rest. For that purpose, we will need operators **take()** and **first()**.

**take()** takes the first several values in the stream (provided in the argument), and completes the stream.

**first()** takes only the very first value from the stream, then completes it. Notice that if the stream completes before emitting any value, an `EmptyError` will be thrown, so **first()** is fundamentally different from **take(1)**.

```ts
import { from } from "rxjs";

import { take, first } from "rxjs/operators";

const source = from([1, 2, 3]);

const sourceTakeTwo = source.pipe(
  // Will take the first two values from the stream and complete it

  take(2)
);

// Will log:

//. 1

//. 2

sourceTakeTwo.subscribe((value) => console.log(value));

const sourceTakeFirst = source.pipe(
  // Will take the very first value and complete the stream

  first()
);

// Will log:

//. 1

sourceTakeFirst.subscribe((value) => console.log(value));
```

Great! Now that we know how to take the first values from a stream, let's see how else we can filter values using **RxJS** operators.

## **distinct()**

Sometimes we only want to operate on unique values, or in other words, ignore duplicates. For that purposes we can utilize the **distinct** operator. It will only pass values that have not been emitted yet.

```ts
import { from } from "rxjs";

import { distinct } from "rxjs/operators";

const source = from([1, 2, 2, 1, 3, 2, 3, 1, 3, 2, 1, 1, 3]).pipe(
  // Will skip duplicates

  distinct()
);

// Will log:

//. 1

//. 2

//. 3

source.subscribe((value) => console.log(value));
```

## **distinctUntilChanged()**

Sometimes though, we will need to skip duplicates, but only if they come one after another. For that, we can use the **distinctUntilChanged()** operator.

**distinctUntilChanged()** skips duplicate values that immediately follow each other.

```ts
import { from } from "rxjs";

import { distinctUntilChanged } from "rxjs/operators";

const source = from([1, 1, 2, 2, 2, 3, 3, 1, 1]).pipe(
  // Will skip the value, if it is a duplicate of the previous one

  distinctUntilChanged()
);

// Will log:

//. 1

//. 2

//. 3

//. 1

source.subscribe((value) => console.log(value));
```

As we can see, **distinctUntilChanged()** skipped only the first duplicates.

#

# **Combining streams**

Sometimes we deal with tasks that require us to handle several streams simultaneously. For starters, let's create some streams to work with. For that purpose we will use the **timer()** function.

## **timer()**

**timer()** creates a stream that emits a value the time (in milliseconds) we provide has passed, essentially working like `setTimeout`, but for streams.

```ts
import { timer } from "rxjs";

// First value will be emitted immediately, the next one in 1000ms

const sourceFirst = timer(0, 1000);

// Will log:

//. 0 immediately

//. 1 in 1.0 second

sourceFirst.subscribe((value) => console.log(value));

// First value in 0.5 second, next one in 1 second

const sourceSecond = timer(500, 1000);

// Will log:

//. 0 in 0.5 sec

//. 1 in 1.5 sec

sourceSecond.subscribe((value) => console.log(value));
```

## **interval**

Next, let's learn how to create a stream that emits over time, but repeatedly (like `setInterval`). For that purpose, we have the **interval** function:

```ts
import { interval } from "rxjs";

const source$ = interval(1000);

// Will log:

//. 0 in 1 second

//. 1 in 2 seconds

//. 2 in 3 seconds

// and so on

source$.subscribe((value) => console.log(value));
```

## **combineLatest()**

Now let's combine values of those streams! We will learn to use the **combineLatest()** operator.

**combineLatest()** unites the values of all the provided streams and emits the latest emitted values of each one of them in an `Array`. So, for example, if one stream emits, that value will be combined with all the latest values emitted from other `Observables` in that array, and emitted together.
**Important!** Notice that **combineLatest** only starts emitting after each source `Observable` has emitted at least one value. Values emitted before this moment are ignored by the resulting `Observable`.

```ts
import { interval, combineLatest } from "rxjs";

const sourceFirst = interval(500);

const sourceSecond = interval(1000);

const source = combineLatest([sourceFirst, sourceSecond]);

// Will log:

//. [1, 0] in 1 second

//. [2, 0] in 1.5 seconds

// [3, 1] in 2 seconds

// and so on

source.subscribe((value) => console.log(value));
```

Despite the values of these two streams are generated at different times, we manage to combine them into a single value which allows us to handle values from two different streams simultaneously. **combineLatest** allows us to combine as many `Observables` as we want, not just two.

## **withLatestFrom()**

As you could see, we received a new value each time any of the two streams emitted. But what if we need to receive a value only when the source `Observable` emits? Let's achieve that using the **withLatestFrom()** operator.

**withLatestFrom()** combines the source `Observable` with another one, and emits a combined value only when the source one emits.

```ts
import { interval } from "rxjs";

import { withLatestFrom } from "rxjs/operators";

const sourceFirst = interval(1000);

const sourceSecond = interval(500);

const source = sourceFirst.pipe(withLatestFrom(sourceSecond));

// Will log:

//. [0, 1] in 1.0 second

// [1, 3] in 2.0 seconds

// [2, 5] in 3.0 seconds

source.subscribe((value) => console.log(value));
```

The only difference from **combineLatest** is that it will only emit when the source `Observable` emits. It won't emit if the `Observable` we passed to **withLatestFrom** has not emitted at all, even when the source `Observable` emits. This is similar to **combineLatest**, for instance in this example, the first emission from `sourceSecond` will be ignored.

#

# **Handling errors in streams**

In real life application some exceptional situations may arise, in which cases we will need to correctly handle errors. Let's create an error and see how it goes.

```ts
import { from } from "rxjs";

import { map } from "rxjs/operators";

const source = from([1, 2, 3]).pipe(
  // Something went wrong!

  map(() => {
    throw new Error("Unexpected 🙀!");
  })
);

// An Error will be thrown:

//. Error: Unexpected 🙀!

source.subscribe((value) => console.log(value));
```

In this case, this `Error` is not being handled at all. Before we get started though, let's learn how to throw errors the RxJS way.
In some situations, we may need to throw errors ourselves (for example, if an invalid value arises in the stream). This can be done using the `throwError` function. Let's get to know it: `throwError` is a function that returns an `Observable` that immediately throws an error, which we can specify with its argument. Here it is in action:

```ts
import { throwError } from "rxjs";

throwError("Something went wrong").subscribe(
  (value) => console.log(value),
  (error) => console.log(error)
);

// Will log "something wen wrong: in the console as an error (colored red)
```

In this example, we have provided a second callback to the `.subscribe` function. This is the error callback, which gets called if there is an unhandled error in the stream.

To handle it, we will need to learn how to use the **catchError()** operator.

**catchError()** handles all the errors that happen inside the stream. Notice that when an error happens, the old stream completes, so we need to return a new stream from that operator.

```ts
import { throwError, of } from 'rxjs';

import { catchError } from 'rxjs/operators';

const source = throwError('Something went wrong!').pipe(
  // Something went wrong!
  // Let's handle it!

  catchError(() => of("Error handled 😻!")),
);

// Will log:

//. Error handled 😻!

source.subscribe(value => console.log(value);
```

Now we can be sure the code will work correctly, and all the errors will be handled.

# **In Conclusion**

We got to know the most common **RxJS** operators and learnt to:

- Change values in a stream
- Filter values
- Combine streams
- Handle errors
