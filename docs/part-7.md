---
id: part-7
title: Part 7. Functional Programming
---

# Functional Programming

Contributors:

- Sergi Dote Teixidor

## Introduction

Functional programming is a paradigm that puts attention on functions. But this definition can be a little confusing since developers are coding using functions and methods and this doesn't mean they are programming following the Functional Programming paradigm.

Functional Programming talks about abstract control flows, data mapping, operations, immutability, and other concepts we are reviewing in the next steps.

Change our mind to a Functional Programming perspective takes a while.

## What is Functional Programming really?

Functional programming comes from mathematical logic, and λ-calculus. The λ-calculus helps us to describe programs as data transformations using function applications.

Functional Programming teaches us to decompose a problem into simple functions and chain them to get a result. Thinking like this, we can break the complexity of a program and achieve any problem as a sequence of easy steps.

A perfect description is what Michael Feathers said:

> OO makes code understandable by encapsulating moving parts. FP makes code understandable by minimizing moving parts.

### Functional Programming is declarative

There are two programming paradigms:

**Imperative:**
It determines HOW TO DO things, describing step by step what we need to do to get our result. Each instruction changes the state.

**Declarative:**
It determines WHAT TO DO, not HOW.

Under this paradigm we define which operations are involved but we don't specify how to do in the low-level (loops, conditions, assignments, ...).

Functional programming is declarative, it defines operations and data flows without any strict control flow definition.

## Functional Programming concepts

In this section, we list the key features of FP.

### Immutability

We cannot modify immutable data after its creation. When mutating data, we are producing side effects and we cannot ensure the program's correctness.

Immutability is a core concept of Functional Programming, without it, you cannot ensure the data flow is working properly, getting a buggy program.

### Pure functions and side effects

With Functional Programming our code becomes immutable, using pure functions. Pure functions don’t manipulate outer variables or input parameters: **Same inputs produce same outputs.**

Pure functions don’t have side effects, getting a simpler code.

This is a pure function (we never mutate the `val` parameter):

```ts
const increment = (val: number) => val + 1;
```

When using impure functions, we are running into side effects. In this case we cannot predict code alterations, and that produces buggy code. Side effects modify the state of the program or system, resulting an uncontrollable and unreliable code.

This is an impure function:

```ts
function increment(val: number): number {
    val += 1;
    return val;
}
```

### Referential transparency

A function that with the same inputs always produces the same output, is a referentially transparent function.

That means we can replace this kind of functions by their expression without changing the program behavior. This statement is an important pillar providing us correctness and algorithm simplicity and allowing lazy evaluation and memorization.

### Partial application and Currying

Partial application means fixing any number of arguments to a function, producing another function of smaller arity.

The currying concept (created Haskell Curry) is the technique of converting a function that takes multiple arguments into a sequence of functions that each takes a single argument.

For instance, this function:

```ts
function add(a: number, b: number): number {
    return a + b;
}
```

We can curry the function like this:

```ts
const add = (a: number) => (b: number) => a + b;
```

Usage:

```ts
const ten = add(5)(5);
```

With currying, we can create new functions from others:

```ts
const add10 = add(10);

const result = add10(5);
```

By defining the `add10` function, we have a new function that we execute when we have provided all parameters (the function requires a second parameter).

### Function composition

Pure functions can be composed to get our expected result. Using the function composition technique, we can decompose any problem into simpler functions with only one responsibility and solve it by chaining these pieces.

In the following, we solve a given a problem first with imperative code, then declarativelly with Functional Programming using function composition.

Having this interface:

```ts
enum Gender {
  Female = 'Female',
  Male = 'Male',
  Other = 'Other'
}

interface Student {
  name: string;
  lastName: string;
  gender: Gender;
  university: string;
}
```

We want to find all women studying in 'Union College'.

Under an imperative perspective, can be solve like this:

```ts
function getWomenFromUnionCollege(students: Array<Student>) {
  const women = [];

  for (const s of students) {
    if (s.gender === Gender.Female && s.university === 'Union College') {
      women.push(s);
    }
  }

  return women;
}
```

This function has a single responsibility but is not reusable and we are instructing the program on what to do to reach the result.

One solution following a Functional Programming approach, could be this:

```ts
const select =
  <T, K extends keyof T & string = any>(key: keyof T, value: T[K]) =>
  (obj: T) =>
    obj[key] === value;

const isWoman = select<Student>('gender', Gender.Female);

const getWomen = (students: Array<Student>) => students.filter(isWoman);

const fromUnionCollege = select<Student>('university', 'Union College');

const womenFromUnionCollege = getWomen(students).filter(fromUnionCollege);
```

In this case we are telling what we need, but not how to do this:

- We have a generic function (`select`), that we use to create another function.
- By combining the functions, we get the desired result.

#### Function chaining

Talking about function composition, a related concept is *function chaining*. It is another way to combine functions to get a result. An example is RxJS' `pipe` function which allows us to chain operators, creating a data flow that will give us the final value.

Let's create the `pipe` function for chaining pure functions:

```ts
const pipe = (fns) => (x) => fns.reduce((v, f) => f(v), x);
```

Using this previous definition, we can chain functions:

```ts
const oddNumbers = (numbers: Array<number>) => numbers.filter(_ => _ % 2 !== 0);

const power = (pow: number) => (numbers: Array<number>) => numbers.map(_ => _ ** pow);

 pipe(
    oddNumbers,
    power(2),
  )([1, 2, 3, 4, 5, 6, 7, 8, 9]) // output: [1, 9, 25, 49, 81]
```

Because all involved functions are pure, we can ensure the result has never any side effect.

### High Order Functions

In Functional Programming, a function is a first-class citizen of the language which means that a function is just another value.

A good example is the JavaScript `filter` function:

```ts
filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];
```

A function that will apply a function given as a parameter.

This is so powerful. Let's see an example:

```ts
const repeat = (times, funct, initial) =>
  times > 1 ? repeat(times - 1, funct, funct(initial)) : funct(initial);
```

This function will repeat given function N times from an initial value. The good thing is having this function we can do other functions, only passing the function we want to work with:

```ts
const rateMovie = (stars) => repeat(stars, (_) => _ + '*', '');

console.log(rateMovie(5)); // output: *****
```

or:

```ts
const increment = (value) => (times) => repeat(times, (_) => _ + 1, value);

console.log(increment(2)(1)); // output: 3
```

### Point-Free Notation

Because Functional Programming is about readability too, how we write code is particularly important.

Let's explain the concept with an example. Given this function:

```ts
const isBiggerThan10 = (x: number) => x > 10;
```

Which we can use like this:

```ts
[1,2,3,20,34,12,6].filter(num => isBiggerThan10(num));
```

Obviously, this is working but could be easier to read.

We specify the parameter `num` twice. Because the inner function is expecting the same declared parameter in the left part of the provided function, we can apply point-free notation:

```ts
[1,2,3,20,34,12,6].filter(isBiggerThan10);
```

We have reduced verbosity which implies simplicity.
