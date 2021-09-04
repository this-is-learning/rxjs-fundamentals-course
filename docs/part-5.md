---
id: part-5
title: "Part 5. Everything is a stream: Push-based architecture"
---

# Everything is a stream: Push-based architecture

Contributors:

- Lars Gyrup Brink Nielsen

# Everything is a stream

JavaScript started in the browser in 1995. Everything was executed in the same, single thread. Why would it be any different in a time when most computers were only able to run a single thread at a time? Today, the more modern worker APIs run in separate threads to prevent the main thread from blocking and use the power of multithreading that all devices support by now.

JavaScript evolved as an event-based environment. In the beginning, most events were initiated directly by a user interacting with a web page. Today, very complex and complicated applications are executed in the browser. The event-based model is critical to our way of thinking when developing JavaScript applications.

For many other mainstream programming languages, events were strapped on as an afterthought late in their lifecycle.

The DOM has events that bubble up through the element tree from where its emitted all the way to the document root, unless they are intercepted and stopped before they reach the root element.

What or who initiates events in the DOM? Usually a user interacting with the page. So what can we express with DOM events? Mouse clicks, keypresses, screen drags, screen taps, and selections. There are probably a few more, but you get the idea.

It turns out that most interesting things that happen in a browser are asynchronous events. An XHR request emits events when it has succeeded or failed. A web socket emits messages or errors. A script element or an image element emits an event once loaded or on errors. A file reader emits events when operations complete, progress, or fail. The list goes on.

A button can be clicked multiple times, not just once. Every button click happens at a certain point in time, each moment being unique.

What if we took all those button clicks and put them in a container object that we could pass around or expose to different parts of our application? We would have an object representing button clicks over time. A stream of button clicks.

It turns out that as most interesting things that happen in JavaScript happen asynchronously and intermingled, it's quite useful to be able to capture cohesive events or values in a stream.

In fact, we can represent almost anything as a stream. The keys pressed by the user in a certain form control, the number of seconds elapsed (approximately) since the session was started or a button was clicked, or messages in a web socket connection.

Even an HTTP request can be represented as a stream. It's initialized when the request is fired, then we wait for a single response and finally the stream ends. A stream with only a single value at only a single moment in time, but in fact a stream.

As we have discussed earlier in this course, in RxJS, observables are the streams of data, the container objects. So of course, the way we represent any piece of data, synchronously or asynchronously, is through observables.

Here are a few examples of how we can create streams from DOM events.

```typescript
import { fromEvent } from "rxjs";

const leftClick$ = fromEvent(document, "click");

const keypress$ = fromEvent(
  document.getElementById("form-control"),
  "keypress"
);
```

RxJS lets us compose these streams by combining them. Now imagine a keylogger that records every keypress. If we had a record button and a stop button, our composed stream would look like this.

```typescript
import { fromEvent } from "rxjs";

import { exhaustMap, map, takeUntil } from "rxjs/operators";

const recordButtonClick$ = fromEvent(
  document.getElementById("record-button"),
  "click"
);

const stopButtonClick$ = fromEvent(
  document.getElementById("stop-button"),
  "click"
);

const keypress$ = fromEvent(document.body, "keypress");

const keylogger$ = recordButtonClick$.pipe(
  // [1]

  exhaustMap(() =>
    keypress$.pipe(
      // [2]

      map((event: KeyboardEvent) => event.key), // [3]

      takeUntil(stopButtonClick$) // [4]
    )
  )
);

keylogger$.subscribe((key) => console.log(key));
```

What's going on here? The first few observables are similar to the ones we just discussed, except `keypress$` catches all keypresses when the browser tab is active.

The `keylogger$` is an observable composed from the three DOM-event based observables. First we listen for a click on the record button (1). Then we start listening for keypresses (2) and map the keypress events to a string with the key in question (3). We stop listening when the stop button is clicked (4).

Finally, we output the emitted values from `keylogger$`.

## Service with a subject

Now that we have learnt about constructing our applications using the _Everything is a stream_ mantra, we can consider other use cases that are a good fit for application frameworks such as Angular and React.

The _Service with a subject_ pattern is the first stage of application state management for reactive applications. We create a class that uses RxJS Subjects to manage shared state.

Let's look at a user service which exposes observable state about user details and whether a user is authenticated. Additionally, it allows a user to log in and log out.

In this example, we will communicate with a real web API and query demo users to simulate a log in. Any username listed in [https://jsonplaceholder.typicode.com/users](https://jsonplaceholder.typicode.com/users) will allow the user to log in.

```typescript
import { BehaviorSubject, Observable, of, throwError } from "rxjs";

import { fromFetch } from "rxjs/fetch";

import {
  catchError,
  map,
  mapTo,
  shareReplay,
  switchMap,
  tap,
} from "rxjs/operators";

interface User {
  readonly email: string;

  readonly name: string;

  readonly username: string;
}

class UserService {
  private user = new BehaviorSubject<User | undefined>(undefined); // [1]

  user$: Observable<User | undefined> = this.user.asObservable(); // [2]

  isAuthenticated$: Observable<boolean> = this.user.pipe(
    // [3]

    map((user) => user !== undefined) // [4]
  );

  logIn(username: string, password: string): Observable<void> {
    return fromFetch(
      "[https://jsonplaceholder.typicode.com/users](https://jsonplaceholder.typicode.com/users)"
    ).pipe(
      // [5]

      switchMap((response) => response.json()), // [6]

      map((users: ReadonlyArray<User>) =>
        users.find((user) => user.username === username)
      ), // [7]

      switchMap((user) =>
        user
          ? of(user)
          : throwError(new Error(`No user with username "${username}"`))
      ), // [8]

      tap({
        error: () => this.user.next(undefined), // [9]

        next: (user) => this.user.next(user), // [10]
      }),

      mapTo(undefined) // [11]
    );
  }

  logOut(): Observable<void> {
    return fromFetch(
      "[https://jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com/)"
    ).pipe(
      // [12]

      catchError((error) => of(error)), // [13]

      tap(() => this.user.next(undefined)), // [14]

      mapTo(undefined) // [15]
    );
  }
}
```

The private property `user` (1) holds either a user data structure or `undefined` depending on whether a user is logged in or not. It's based on a `BehaviorSubject` which always has an initial state, in this case `undefined`.

The public observable `user$` property (2) exposes user details when a user is logged in.

The public observable `isAuthenticated$` property (3) is a computed observable based on the `user` behavior subject. It emits the values `true` or `false` based on whether a user is logged in or not (4).

That's our observable pieces of state. Let's walk through the `logIn` method.

First, we create an observable from an HTTP request using `fromFetch` (5). Then we parse the HTTP response as JSON (6).

As this is a demo, we just look for a user with a username matching the specified one between the ones in the HTTP response (7). If no user with that username exists, we emit an error in our stream (8).

If an error occurs, logging in has failed. When this happens, we clear the user state (9). If logging in succeeds, we set the user state to the user data structure identified in the response (10).

Finally, we make sure the returned observable emits `undefined` on success before completing (11).

The `logOut` method is much simpler. We do some arbitrary HTTP request because this is a demo (12). If the request fails, we convert the error to an observable to avoid that the stream fails (13).

For demo purposes, we always clear the user state (14) and make sure that `undefined` is emitted before completing (15).

What does this service allow us to do? It allows us to share user-related state and the methods to change that state from anywhere in our application. Pieces of UI or other services interested in user-related state can subscribe to the exposed observable properties.

Pieces of UI can use the methods to log in or log out based on user interactions.

## Reactive application state management frameworks

We have already seen how we can use RxJS subjects to manage shared state. However, many pieces of state share the same, tedious recipe and it can be difficult to maintain the same patterns across a large codebase or between multiple teams. We risk a fragmented codebase where different patterns have been used depending on the time the state services were made or who made them.

You might have heard about application state management frameworks. Through conventions and patterns, they help us structure the shared in our applications. Many are based on the flux or redux patterns where we have an action which is an event that signals that state should be updated or some side effect should be triggered. Such an event can be dispatched from anywhere within our applications.

In such frameworks, we usually also have a reducer which is a function that reduces the current state and an action to a new state. Finally, we can subscribe to state updates from a so-called _store_. In this way, we decouple data updates and UI updates so that both can happen in multiple places without tight coupling.

For React, an idiomatic example of this is Redux. For Angular, it is NgRx Store. There are countless others, for example we can combine Redux with Redux-Observable to create and trigger side effects based on RxJS. However, Redux in itself doesn't use RxJS, so we'll go with Akita as a case study since it is an application framework-agnostic state management framework based on RxJS.

We will disregard side effects in this example to keep it simple.

Let's first look at our domain model, the `Book` interface and the related factory, `createBook`.

```typescript
// book.ts

export interface Book {
  author: string;
  price: number;
  title: string;
}

export function createBook(params: Partial<Book>) {
  return {
    ...params,
  } as Book;
}
```

Every book in our application state has an author, a price and a title. The factory allows us to create a book data structure with some or all properties defined.

The next thing we need in Akita is a store. We will name it `BookStore`.

```typescript
// books.store.ts

import { Store, StoreConfig } from "@datorama/akita";

import { Book } from "./book";

export interface BooksState {
  books: Book[];
}

export function createInitialState(): BooksState {
  return {
    books: [
      {
        author: "Paul P. Daniels and Luis Atencio",
        price: 33.65,
        title: "RxJS in Action",
      },
      {
        author: "Randall Koutnik",
        price: 41.78,
        title:
          "Build Reactive Websites with RxJS: Master Observables and Wrangle Events",
      },
      {
        author: "Sergi Mansilla",
        price: 32.95,
        title:
          "Reactive Programming with RxJS 5: Untangle Your Asynchronous JavaScript Code",
      },
    ],
  };
}

@StoreConfig({ name: "books" })
export class BooksStore extends Store<BooksState> {
  constructor() {
    super(createInitialState()); // [1]
  }
}
```

First we declare the interface of the shared state related to books, `BooksState`. In this simple example, it only contains an array of all the books in our application in the `books` property.

Next, we have the `createInitialState` factory which is used to hydrate the state of our books store (1).

The `BooksStore` only contains configuration on top of the base `Store` class from Akita.

Now we need a books query class to select pieces of state from the books store.

```typescript
// books.query.ts

import { Query } from "@datorama/akita";
import { Observable } from "rxjs";

import { BooksState, BooksStore } from "./books.store";

export class BooksQuery extends Query<BooksState> {
  constructor(protected store: BooksStore) {
    super(store);
  }

  books$: Observable<Book[]> = this.select((state) => state.books);
}
```

The `BooksQuery` class exposes observables properties that selects or computes state based on one or more pieces of state from the books store.

That's all the state we need for a simple application.

The piece we're skipping here is side effects and mutations. If we wanted to asynchronously load books from a server or allow the user to add, delete or edit books, we would create a `BooksService` class which would in turn use the `BooksStore#update` method to update the books state. Akita even has base classes for managing collections called `EntityStore` and `EntityQuery` that we can use instead of the `Store` and `Query` base classes.

## A reactive React application

Now we will build on top of Akita's state management with simple React components and an RxJS-compatible hook.

Let's start with the innermost component, the `Book` component.

```jsx
// Book.jsx

import React from "react";

export const Book = ({ author, price, title }) => (
  <div class="book">
    <h1>{title}</h1>
    <p>By {author}</p>
    <p>Price: USD {price}</p>
  </div>
);
```

This is a simple functional presentational component. It accepts author, price and title props and renders them in a simple HTML structure.

Next is the `BookList` component.

```jsx
// BookList.jsx

import React from "react";

import { Book } from "./book";

export const BookList = ({ books }) =>
  books.map((book) => <Book key={book.title} {...book} />);
```

The book list component is another functional presentational component that accepts a `books` prop which is an array of book data structures. It maps the array into a list of `Book` components with the book title as the list key because we didn't include any other identifier. All the properties of the book data structure is spread as props on the `Book` component.

The final component is the `BooksPage` which is the container of the state.

```jsx
// BooksPage.jsx

import useSelector from "@nitor-infotech/rxjs-use-selector";

import React from "react";

const booksStore = new BooksStore();

const booksQuery = new BooksQuery(booksStore);

export const BooksPage = () => {
  const books = useSelector(booksQuery.books$, []); // [1]

  return <Books books={books} />;
};
```

The books page is a functional container component. It uses the `useSelector` to get updates from the observable property `BooksQuery#books$` (1).

If the books query was to be reused in other places in our application, we would initialize it in a `booksQuery` constant in the `books.query.ts` file.

With the snapshot of the `books` state, our component renders a `Books` component and passes the books array to its `books` prop.

## A reactive Angular application

Let's build the same simple components in Angular for comparison.

We start out with the `BookComponent`.

```typescript
// book.component.ts

import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from "@angular/core";

import { Book } from "./book";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,

  selector: "books-book",

  template: `
    <h1>{{ book.title }}</h1>

    <p>By {{ book.author }}</p>

    <p>Price: USD {{ book.price }}</p>
  `,
})
export class BookComponent {
  @Input()
  book: Book;

  @HostBinding("class")
  hostClassList = "book";

  @HostBinding("style")
  hostStyle = "display: block;";
}
```

The presentational book component accepts a `Book` data structure as an input property and displays its properties in its component template. We use host bindings to apply style to the custom host element.

Note that we used the `OnPush` change detection strategy as our component only needs to be dirty checked when the reference of its input property changes.

Next, let's take a look at the `BookListComponent`.

```typescript
// book-list.component.ts

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Book } from "./book";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,

  selector: "books-list",

  template: `
    <books-book
      *ngFor="let book of books; trackBy: trackBookTitle"
      [book]="book"
    ></books-book>
  `,
})
export class BookListComponent {
  @Input()
  books: Book[];

  trackBookTitle(index: number, item: book): string {
    return book.title;
  }
}
```

The book list component accepts a book array, loops over them and creates a list of book components which are passed the individual book data structures.

Similar to the book component, we use the `OnPush` change detection strategy as the `BookListComponent` is a presentational component that only needs to be dirty checked when the books array reference changes. This requires working with the array in an immutable way, but this is a common practice in application state management.

The last component is the `BooksPageComponent` which is implemented like this:

```typescript
// books-page.component.ts

import { ChangeDetectionStrategy, Component } from "@angular/core";

import { Observable } from "rxjs";

import { Book } from "./book";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,

  selector: "books-page",

  template: ` <books-list [books]="books$ | async"></books-list> `,
})
export class BooksPageComponent {
  books$: Observable<Book[]> = this.booksQuery.books$;

  constructor(private booksQuery: BooksQuery) {}
}
```

The books page component is a container component that provides the books state to its child component, the `BookListComponent`.

We inject the `BooksQuery` service and expose its observable `books$` property in the component model. This property is then passed through the async pipe before being bound to the `books` input property of the book list component.

We can also use the `OnPush` change detection strategy for this component even though it is a container component. The async pipe will mark it as dirty and the NgZone will schedule a change detection cycle every time the `books$` observable emits a value.

In Angular we also need a declaring Angular module. In our case, it's the `BooksModule` which we will walk through next.

```typescript
// books.module.ts

import { CommonModule } from "@angular/common";

import { NgModule } from "@angular/core";

import { BookComponent } from "./book.component.ts";

import { BookListComponent } from "./book-list.component";

import { BooksPageComponent } from "./books-page.component";

@NgModule({
  declarations: [
    // [1]

    BookComponent,

    BookListComponent,

    BooksPageComponent,
  ],

  imports: [
    CommonModule, // [2]
  ],

  providers: [
    // [3]

    BooksStore,

    {
      provide: BooksQuery,

      deps: [BooksStore],

      useFactory: (booksStore: BooksStore) => new BooksQuery(booksStore), // [4]
    },
  ],
})
export class BooksModule {}
```

The books Angular module declares all of our components (1) and imports the `CommonModule` (2) so that the components can use the `AsyncPipe` and the `NgFor` directive.

Because we didn't add `Injectable` decorators to the BooksStore and BooksQuery services, we need to add providers (3) to be able to inject the books query into our books page component.

We have to use a factory provider (4) for the `BooksQuery` service because it depends on the `BooksStore` service.

## Conclusion

That's it for the "Everything is a stream" chapter. I hope you enjoyed learning about concrete reactive UI use cases.

Today we learned about how to capture DOM events as observable streams. We saw an example composing streams into another stream in a declarative way.

We built a user service with a subject to manage two pieces of state. We then discussed how we can use a state management framework like Akita to structure our state.

Finally, we first created a page of React components which got their state from an Akita service. Then we created the same page of components using Angular, still reusing the same Akita service.
