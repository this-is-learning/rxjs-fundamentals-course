LInks to help for ideas:

[https://twitter.com/BenLesh/status/1260332868234022914](https://twitter.com/BenLesh/status/1260332868234022914)

[https://gitlab.com/in-depth-education/angular-in-depth/angular-in-depth-guides/-/blob/master/software-architecture/reactive-programming.md](https://gitlab.com/in-depth-education/angular-in-depth/angular-in-depth-guides/-/blob/master/software-architecture/reactive-programming.md)

[https://www.angulardenver2019.com/reactive-angular?utm_source=Mailchimp&amp;utm_medium=Email&amp;utm_campaign=AD_Reactive_Angular&amp;utm_content=Button](https://www.angulardenver2019.com/reactive-angular?utm_source=Mailchimp&utm_medium=Email&utm_campaign=AD_Reactive_Angular&utm_content=Button)

[https://medium.com/@bhavay.pahuja/rxjs-a-introduction-70098351498f](https://medium.com/@bhavay.pahuja/rxjs-a-introduction-70098351498f)

[https://gist.github.com/staltz/868e7e9bc2a7b8c1f754](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)

# Outline

1. Async programming issues: race conditions, combinations, repeat/retry logic, etc

Answers: setTimeout, Promises, async/await - why are these not an answer?

Why not Promises? Promises vs Observables (what is similar and how they differ?) Light comparison (then vs subscribe, catch vs catchError, lazy vs eager, etc)
(writer - Oleksandr Poshtaruk)

Links for ideas (not part of the article - possibly for 'read more' section)

[https://itnext.io/promises-vs-observables-for-angularjs-to-angular-migration-1161afacef7e](https://itnext.io/promises-vs-observables-for-angularjs-to-angular-migration-1161afacef7e)

2. Reactive programming and RxJS:
   (writer - Nate Lapinski)

The building blocks of RxJS (need more clarification)

- declarative vs imperative
- Observer pattern
- Notifications (next, complete, error) - how to use different handlers
- Observables
- Subscribers
- Subscriptions
- Subjects
- Operators - a real RxJS power (I'll use map and filter as basic examples, and explain how operators are "linked" to each other when composed together)

TODO: Add more details using map and filter as examples, and maybe show some sample implementations. Talk about how operators subscribe to one another internally, when composed together.

3. mostly used operators: map, catchError, distinctUntilChanged, filter, skip, first, take, combineLatest, [withLastestFrom] (writer - Fox)

4. How RxJS is used by Angular: (writer - Andrei Gatej)

- http (the simiplest + repeat/retry, mention .toPromise )
- Forms (valueChanges)
- ViewChildren (.changes)
- Interceptors ()
- Guards
- Route Resolvers

# Notes

- I decided not to include `toPromise` in the _HttpClientModule_ section as it's not specifically related to that module, but to Observables

5. Everything is a stream: Pushed based architecture: (writer - Lars Gyrup Brink Nielsen)

(mention application state management principles - very beginner staff)

- Services with BehaviorSubjects (maybe small Subjects intro - no multicasting - just that you can emit value with .next method)
- Application state management (ngRx basic example)

- Also mention ngxs, Akita for homework

6. Creational operators

7. What is next?
   (Links to help:
   [https://twitter.com/thekiba_io/status/1136908291366408192](https://twitter.com/thekiba_io/status/1136908291366408192)
   [https://t.co/YDMpsKVgwN?amp=1](https://t.co/YDMpsKVgwN?amp=1)
   )

More to go (just mention use-cases (no details) - details will be provided another course - Advanced RxJS):

Multicasting

- share, publish, refCount, multicast, connect, and connectable observables

Subjects

Schedulers

Cold, hot, warm observables

Flattening observables

- merge\*
- exhaust\*
- switch\*
- concat\*

Marble Testing

- Visualizing the diagrams(how the TestScheduler adds actions to the queue)
- How the testing of high order observables can be visualized(extending the prev point)

Clarifying differences between similar operators:

- sampleTime vs auditTime
