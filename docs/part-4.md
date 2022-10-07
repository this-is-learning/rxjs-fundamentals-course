---
id: part-4
title: Part 4. How RxJS is used by Angular
---

# How RxJS is used by Angular

Contributors:

- Andrei Gatej

# How RxJS is used by Angular

_Writer: Andrei Gatej_

In this chapter, we're going to expose which parts of Angular are powered by RxJS, along with some practical examples.

## HttpClientModule

_If you'd like to follow along, you could open this_ [_StackBlitz demo_](https://stackblitz.com/edit/rxjs-basics-http?file=src%2Fapp%2Fapp.component.ts)_._

Making requests over the network definitely complies with a well known Observable definition: _data which comes over time_. With this in mind, an HTTP request can be seen as an Observable that will emit some data at some point in the future. Let's see how it would look like:

```ts
users$: Observable<any[]> = this.http.get<any[]>(this.url);

constructor (private http: HttpClient) { }
```

The _HttpClient.get(url)_ method will perform a GET request to the specified _url._ This method(and the similar ones, e.g _post, put_ etc...) will return an _Observable_ which will emit once the response is ready and then it will emit a _complete notification._ This implies that there is **no need** to explicitly unsubscribe from an observable returned from _HttpClient._

In order to get a better understanding, here's how you could loosely implement something similar to what the _HttpClient_ does:

```ts
new Observable((subscriber) => {
  // Make the request here, e.g using `fetch` or `XMLHttpRequest`
  // Then, after the response(`resp`) is ready
  subscriber.next(resp);
  subscriber.complete();
});
```

Another great feature the _HttpClientModule_ provides is the ability to intercept and alter the **requests** and **their responses.** This can be achieved with **Interceptors.**

For example, this is how an interceptor can be provided:

```ts
{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
```

And this is how it might be implemented:

```ts
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Altering the incoming request, e.g: adding necessary headers
    const newReq = req.clone({
      setHeaders: { Authorization: "<schema-type> <credentials>" },
    });

    return next.handle(newReq).pipe(
      // Altering the response
      // Only interested in `Response` events. Others could be: `Sent`, `UploadProgress` etc...
      filter((e) => e.type === HttpEventType.Response)

      // Can also retry requests, maybe the authorization token expired, so we can use the refresh token to get a new one
      // catchError(err => handleExpired()),
    );
  }
}
```

As you can see, interceptors come up with a lot of possibilities. This is possible because RxJS' Observables can be **composed**.

For example, you might have something like this:

```ts
const be$ = new Observable((subscriber) => {
  setTimeout(() => {
    // After the request is ready
    subscriber.next({ data: {}, err: null });
    subscriber.complete();
  }, 3000);
});

// Applying an interceptor
const intercepted$ = be$.pipe(filter(/* ... */), catchError(/* ... */));

// Applying another interceptor
const interceptedTwice$ = intercepted$.pipe(/* ... */);
```

## Forms

_If you'd like to follow along, you could open this_ [_StackBlitz demo_](https://stackblitz.com/edit/rxjs-basics-forms?file=src/app/app.component.ts)_._

Sometimes, when working with Angular Forms, you might need to perform certain actions when the **value** or the **status** of a **form control** changes. You can be notified about these events with the help of _valueChanges_ and _statusChanges_.

Let's see how they can be used:

```ts
this.valueChangesSub = this.myCtrl.valueChanges.subscribe((v) => {
  console.log("value changed", v);
});

this.statusChangesSub = this.myCtrl.statusChanges.subscribe((v) => {
  console.log("status changed", v);
});
```

When typing into the input, both the registered callbacks will be called. _valueChanges_ emits when the **control's value** has changed and _statusChanges_ when the **control's status** changed(e.g from _INVALID_ to _VALID_).

As with every observable, you can apply **operators** to it. For instance, you might want to be notified only when the current status is different than the previous one:

```ts
this.statusChangesSub = this.myCtrl.statusChanges
  .pipe(distinctUntilChanged())
  .subscribe((v) => {
    console.log("status changed", v);
  });
```

One thing that you should be mindful of is that you **don't** have to unsubscribe from these observables when the component is destroyed because the data producer(e.g _valueChanges_) belongs to the component in question, thus everything becomes eligible for garbage collection.

## Querying elements from the DOM

_If you'd like to follow along, you could open this_ [_StackBlitz demo_](https://stackblitz.com/edit/rxjs-basics-query?file=src%2Fapp%2Fapp.component.ts)_._

You might be familiar with _ViewChildren_ and _ContentChildren_ decorators. They can be used to query elements from a component's view and from a component's projected content, respectively. Both return a _QueryList_ type.

One thing that might come handy in certain situations is to be notified about changes that occur in the list obtained, changes such as **addition** or **removal.** This is possible as the _QueryList_ structure exposes a _changes_ property which emits whenever the actions delineated above take place.

Here is an example of _ViewChildren:_

```html
<ul>
  <li *ngFor="let _ of [].constructor(total); index as idx" #item>
    {{ idx + 1 }}
  </li>
</ul>

<hr />
<br />

<button (click)="total = total - 1 < 0 ? 0 : total - 1">Remove Item</button>
<button (click)="total = total + 1" style="margin-left: 3rem;">Add Item</button>
```

And the corresponding TS file:

```ts
@Component({ ... })
export class AppComponent {
  total = 10;

  @ViewChildren('item') private items: QueryList<HTMLUListElement>;

  ngAfterViewInit () {
    this.items.changes.subscribe(changes => {
      console.log('changes occurred', changes);
    });
  }
}
```

One thing that is worth mentioning is that you don't have to unsubscribe when the component is destroyed as this is handled internally by _QueryList._

## Routing

_If you'd like to follow along, you could open this_ [_StackBlitz demo_](https://stackblitz.com/edit/rxjs-basics-routing?file=src/app/app.module.ts)_._

Another significant part where Angular heavily uses RxJS is **routing**.

For instance, when you want to manage the access to certain routes, you can leverage **guards**.

Each guard can return, among others, _Observables,_ allowing you to perform complex logic when deciding whether the route should be accessed or not.

Let's see an example of _CanActivate:_

```ts
canActivate(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  // The logic might involve Observables
  return timer(1000).pipe(
    map(() => true),
  );
}
```

_Note: the same concept can be applied to other guards._

_Observables_ can also be used when implementing **route resolvers:**

```ts
export class HelloResolver implements Resolve<any> {
  constructor(private http: HttpClient) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.http
      .get<any>("https://jsonplaceholder.typicode.com/posts")
      .pipe(map((arr) => arr.slice(0, 10)));
  }
}
```

The result of the resolver can then be accessed in the component route's component through the _ActivatedRoute.data_ property.
