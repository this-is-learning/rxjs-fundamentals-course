"use strict";(self.webpackChunkrxjs_fundamentals_course=self.webpackChunkrxjs_fundamentals_course||[]).push([[135],{4702:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return l},contentTitle:function(){return s},metadata:function(){return p},toc:function(){return m},default:function(){return c}});var a=t(7462),r=t(3366),o=(t(7294),t(3905)),i=["components"],l={id:"part-6",title:"Part 6. Creational operators"},s="Creational operators",p={unversionedId:"part-6",id:"part-6",isDocsHomePage:!1,title:"Part 6. Creational operators",description:"Contributors:",source:"@site/docs/part-6.md",sourceDirName:".",slug:"/part-6",permalink:"/rxjs-fundamentals-course/docs/part-6",editUrl:"https://github.com/this-is-learning/rxjs-fundamentals-course/edit/main/docs/part-6.md",tags:[],version:"current",frontMatter:{id:"part-6",title:"Part 6. Creational operators"},sidebar:"tutorialSidebar",previous:{title:"Part 5. Everything is a stream: Push-based architecture",permalink:"/rxjs-fundamentals-course/docs/part-5"},next:{title:"Part 7. Functional Programming",permalink:"/rxjs-fundamentals-course/docs/part-7"}},m=[{value:"Preface",id:"preface",children:[]},{value:"<code>of()</code>",id:"of",children:[{value:"Primitive",id:"primitive",children:[]},{value:"Object/Array",id:"objectarray",children:[]},{value:"Sequence of values",id:"sequence-of-values",children:[]}]},{value:"<code>from()</code>",id:"from",children:[{value:"Array",id:"array",children:[]},{value:"String",id:"string",children:[]},{value:"Map/Set",id:"mapset",children:[]},{value:"Promise",id:"promise",children:[]}]},{value:"<code>fromEvent()</code>",id:"fromevent",children:[]},{value:"<code>fromEventPattern()</code>",id:"fromeventpattern",children:[]},{value:"<code>fromFetch()</code>",id:"fromfetch",children:[]},{value:"<code>interval()</code>",id:"interval",children:[]},{value:"<code>timer()</code>",id:"timer",children:[]},{value:"<code>throwError()</code>",id:"throwerror",children:[]},{value:"<code>defer()</code>",id:"defer",children:[]}],d={toc:m};function c(e){var n=e.components,t=(0,r.Z)(e,i);return(0,o.kt)("wrapper",(0,a.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"creational-operators"},"Creational operators"),(0,o.kt)("p",null,"Contributors:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Chau Tran"),(0,o.kt)("li",{parentName:"ul"},"Armen Vardanyan"),(0,o.kt)("li",{parentName:"ul"},"Tiep Phan")),(0,o.kt)("p",null,"The following example demonstrates how to manually create an ",(0,o.kt)("inlineCode",{parentName:"p"},"Observable"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'const observable = new Observable(function subscribe(observer) {\n  const id = setTimeout(() => {\n    observer.next("Hello Rxjs");\n    observer.complete();\n  }, 1000);\n  return function unsubscribe() {\n    clearTimeout(id);\n  };\n});\n')),(0,o.kt)("p",null,'Some are probably wondering: "Do we have to remember this syntax to work with ',(0,o.kt)("inlineCode",{parentName:"p"},"Observable"),"? ",(0,o.kt)("inlineCode",{parentName:"p"},"next"),", then ",(0,o.kt)("inlineCode",{parentName:"p"},"complete"),", and also ",(0,o.kt)("inlineCode",{parentName:"p"},"unsubscribe"),'? This is a little too much of a hassle then". To answer this question, we will start exploring some ',(0,o.kt)("strong",{parentName:"p"},"Operators")," and ",(0,o.kt)("strong",{parentName:"p"},"Functions")," from ",(0,o.kt)("strong",{parentName:"p"},"RxJS")," that are used to create ",(0,o.kt)("inlineCode",{parentName:"p"},"Observable"),"."),(0,o.kt)("h2",{id:"preface"},"Preface"),(0,o.kt)("p",null,"This is a common ",(0,o.kt)("inlineCode",{parentName:"p"},"Observer")," that we'll be using throughout this part. If there is any example that uses a different ",(0,o.kt)("inlineCode",{parentName:"p"},"Observer"),", I'll point it out."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const observer = {\n  next: (val) => console.log('next:', val),\n  error: (err) => console.log('error:', err),\n  complete: () => console.log('complete'),\n};\n")),(0,o.kt)("h2",{id:"of"},(0,o.kt)("inlineCode",{parentName:"h2"},"of()")),(0,o.kt)("p",null,"This is a function used to create an ",(0,o.kt)("inlineCode",{parentName:"p"},"Observable")," from any type of value: primitives, Array, Object, Function etc... ",(0,o.kt)("inlineCode",{parentName:"p"},"of()")," accepts all inputs and will ",(0,o.kt)("inlineCode",{parentName:"p"},"complete")," as soon as all have been emitted."),(0,o.kt)("h3",{id:"primitive"},"Primitive"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"/**\n * output:\n * - next: 'hello'\n * - complete\n */\nof(\"hello\").subscribe(observer);\n")),(0,o.kt)("h3",{id:"objectarray"},"Object/Array"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"/**\n * output:\n * - next: [1, 2, 3]\n * - complete\n */\nof([1, 2, 3]).subscribe(observer);\n\n/**\n * output:\n * - next: {foo: 'bar'}\n * - complete\n */\nof({ foo: \"bar\" }).subscribe(observer);\n")),(0,o.kt)("h3",{id:"sequence-of-values"},"Sequence of values"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"/**\n * output:\n * - next: 1\n * - next: 2\n * - next: 3\n * - next: 'hello'\n * - next: 'world'\n * - next: {foo: 'bar'}\n * - next: [4, 5, 6]\n * - complete\n */\nof(1, 2, 3, \"hello\", \"world\", { foo: \"bar\" }, [4, 5, 6]).subscribe(observer);\n")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"of()")," when called with no arguments will ",(0,o.kt)("inlineCode",{parentName:"p"},"complete")," immediately without any ",(0,o.kt)("inlineCode",{parentName:"p"},"next")," notification"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"/**\n * output:\n * complete\n */\nof().subscribe(observer);\n")),(0,o.kt)("h2",{id:"from"},(0,o.kt)("inlineCode",{parentName:"h2"},"from()")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"from()"),", similar to ",(0,o.kt)("inlineCode",{parentName:"p"},"of()"),", is also a function that creates an ",(0,o.kt)("inlineCode",{parentName:"p"},"Observable")," from some value. However, the difference between ",(0,o.kt)("inlineCode",{parentName:"p"},"from()")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"of()")," is that ",(0,o.kt)("inlineCode",{parentName:"p"},"from()")," only accepts value that is either an ",(0,o.kt)("inlineCode",{parentName:"p"},"Iterable"),", or a ",(0,o.kt)("inlineCode",{parentName:"p"},"Promise"),"."),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"from()")," also ",(0,o.kt)("inlineCode",{parentName:"p"},"completes")," after it emits all values passed in."),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"Iterable is value that can be iterated over. For example: an Array, an Object, a Map, a Set, or a String. When you iterate over a String, you'll receive each character in that string.")),(0,o.kt)("h3",{id:"array"},"Array"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"/**\n * output:\n * - next: 1\n * - next: 2\n * - next: 3\n * - complete\n */\nfrom([1, 2, 3]).subscribe(observer);\n")),(0,o.kt)("p",null,"When ",(0,o.kt)("inlineCode",{parentName:"p"},"from()")," receives an ",(0,o.kt)("inlineCode",{parentName:"p"},"Array"),", it emits the items in sequence similarly to ",(0,o.kt)("inlineCode",{parentName:"p"},"of(1, 2, 3)"),"."),(0,o.kt)("h3",{id:"string"},"String"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"/**\n * output:\n * - next: 'h'\n * - next: 'e'\n * - next: 'l'\n * - next: 'l'\n * - next: 'o'\n * - next: ' '\n * - next: 'w'\n * - next: 'o'\n * - next: 'r'\n * - next: 'l'\n * - next: 'd'\n * - complete: 'complete'\n */\nfrom(\"hello world\").subscribe(observer);\n")),(0,o.kt)("h3",{id:"mapset"},"Map/Set"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const map = new Map();\nmap.set(1, \"hello\");\nmap.set(2, \"bye\");\n\n/**\n * output:\n * - next: [1, 'hello']\n * - next: [2, 'bye']\n * - complete\n */\nfrom(map).subscribe(observer);\n\nconst set = new Set();\nset.add(1);\nset.add(2);\n\n/**\n * output:\n * - next: 1\n * - next: 2\n * - complete\n */\nfrom(set).subscribe(observer);\n")),(0,o.kt)("h3",{id:"promise"},"Promise"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"/**\n * ouput:\n * - next: 'hello world'\n * - complete\n */\nfrom(Promise.resolve(\"hello world\")).subscribe(observer);\n")),(0,o.kt)("p",null,"In a case of a ",(0,o.kt)("inlineCode",{parentName:"p"},"Promise"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"from()")," will unwrap the ",(0,o.kt)("inlineCode",{parentName:"p"},"Promise")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"next")," the ",(0,o.kt)("inlineCode",{parentName:"p"},"resolved")," value (or ",(0,o.kt)("inlineCode",{parentName:"p"},"error")," the ",(0,o.kt)("inlineCode",{parentName:"p"},"rejected"),"). This is also the ",(0,o.kt)("em",{parentName:"p"},"official")," way to convert a ",(0,o.kt)("inlineCode",{parentName:"p"},"Promise")," to an `Observable."),(0,o.kt)("h2",{id:"fromevent"},(0,o.kt)("inlineCode",{parentName:"h2"},"fromEvent()")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"fromEvent()")," is used to convert an ",(0,o.kt)("inlineCode",{parentName:"p"},"Event")," to an ",(0,o.kt)("inlineCode",{parentName:"p"},"Observable"),". For example, ",(0,o.kt)("inlineCode",{parentName:"p"},"DOM Event")," like a mouse click or typing in an Input."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'const btn = document.querySelector("#btn");\nconst input = document.querySelector("#input");\n\n/**\n * output:\n * - next: MouseEvent { ... }\n */\nfromEvent(btn, "click").subscribe(observer);\n\n/**\n * output:\n * - next: KeyboardEvent { ... }\n */\nfromEvent(input, "keydown").subscribe(observer);\n')),(0,o.kt)("p",null,"Notice that ",(0,o.kt)("inlineCode",{parentName:"p"},"fromEvent()")," creates an ",(0,o.kt)("inlineCode",{parentName:"p"},"Observable")," that does not ",(0,o.kt)("inlineCode",{parentName:"p"},"complete")," after emission. This makes total sense because for events like ",(0,o.kt)("inlineCode",{parentName:"p"},"click")," or ",(0,o.kt)("inlineCode",{parentName:"p"},"keydown"),", we would want to keep listening to these events for as long as we need to. In other words, for as long as these DOM Elements are presented to the consumers. ",(0,o.kt)("inlineCode",{parentName:"p"},"fromEvent()")," cannot determine on its own when we no longer need to listen to these events. This also means that we will need to ",(0,o.kt)("inlineCode",{parentName:"p"},"unsubscribe")," from these ",(0,o.kt)("inlineCode",{parentName:"p"},"Observable")," manually to avoid ",(0,o.kt)("strong",{parentName:"p"},"memory-leak"),"."),(0,o.kt)("h2",{id:"fromeventpattern"},(0,o.kt)("inlineCode",{parentName:"h2"},"fromEventPattern()")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"fromEventPattern()")," is a ",(0,o.kt)("em",{parentName:"p"},"low-level")," version of ",(0,o.kt)("inlineCode",{parentName:"p"},"fromEvent()"),". Conceptually, it is similar to ",(0,o.kt)("inlineCode",{parentName:"p"},"fromEvent()")," that is to create ",(0,o.kt)("inlineCode",{parentName:"p"},"Observable")," from events. However, the usage is quite different. ",(0,o.kt)("inlineCode",{parentName:"p"},"fromEventPattern()")," is used to convert ",(0,o.kt)("em",{parentName:"p"},"unconventional")," or ",(0,o.kt)("em",{parentName:"p"},"callback-based")," Events to ",(0,o.kt)("inlineCode",{parentName:"p"},"Observable"),". To understand this better, let's look at some example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'/**\n * output:\n * - next: MouseEvent {...}\n */\nfromEvent(btn, "click").subscribe(observer);\n\n/**\n * output:\n * - next: MouseEvent {...}\n */\nfromEventPattern(\n  (handler) => {\n    btn.addEventListener("click", handler);\n  },\n  (handler) => {\n    btn.removeEventListener("click", handler);\n  }\n).subscribe(observer);\n')),(0,o.kt)("p",null,"Another example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'/**\n * output:\n * - next: 10 10\n */\nfromEvent(btn, "click")\n  .pipe(map((ev: MouseEvent) => ev.offsetX + " " + ev.offsetY))\n  .subscribe(observer);\n\n// fromEventPattern\n// In this example, we\'ll break fromEventPattern() arguments into functions.\n\nfunction addHandler(handler) {\n  btn.addEventListener("click", handler);\n}\n\nfunction removeHandler(handler) {\n  btn.removeEventListener("click", handler);\n}\n\n/**\n * output:\n * - next: 10 10\n */\nfromEventPattern(\n  addHandler,\n  removeHandler,\n  (ev: MouseEvent) => ev.offsetX + " " + ev.offsetY\n).subscribe(observer);\n')),(0,o.kt)("p",null,"From these examples, we can tell that ",(0,o.kt)("inlineCode",{parentName:"p"},"fromEventPattern()")," accepts 3 arguments: ",(0,o.kt)("inlineCode",{parentName:"p"},"addHandler"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"removeHandler"),", and an optional ",(0,o.kt)("inlineCode",{parentName:"p"},"projectFunction"),". Moreover, the behavior isn't that much different from ",(0,o.kt)("inlineCode",{parentName:"p"},"fromEvent()"),"."),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"fromEventPattern()")," gives you the ability to convert the Events using their ",(0,o.kt)("em",{parentName:"p"},"original")," APIs, like we're using the DOM API such as ",(0,o.kt)("inlineCode",{parentName:"p"},"addEventListener")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"removeEventListener")," to convert the ",(0,o.kt)("inlineCode",{parentName:"p"},"MouseEvent")," to ",(0,o.kt)("inlineCode",{parentName:"p"},"Observable"),". With this knowledge, you can apply ",(0,o.kt)("inlineCode",{parentName:"p"},"fromEventPattern()")," with more complex Event APIs like ",(0,o.kt)("inlineCode",{parentName:"p"},"SignalR Hub"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"// _getHub() is an arbitrary function that returns a Hub\nconst hub = this._getHub(url);\n\nreturn fromEventPattern(\n  (handler) => {\n    // open the Websocket\n    hub.connection.on(methodName, handler);\n\n    if (hub.refCount === 0) {\n      hub.connection.start();\n    }\n\n    hub.refCount++;\n  },\n  (handler) => {\n    hub.refCount--;\n    // close the Websocket on Unsubscribe\n    hub.connection.off(methodName, handler);\n    if (hub.refCount === 0) {\n      hub.connection.stop();\n    }\n  }\n);\n")),(0,o.kt)("p",null,"or ",(0,o.kt)("inlineCode",{parentName:"p"},"SocketIO")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'export interface SocketEventMap {\n  event1: string;\n  event2: number;\n}\n\n@Injectable({ providedIn: "root" })\nexport class SocketService {\n  private socket: Socket;\n\n  // init logic\n\n  on<EventName extends keyof SocketEventMap>(\n    event: EventName\n  ): Observabe<SocketEventMap[EventName]> {\n    return fromEventPattern(\n      (handler) => {\n        this.socket?.on(event, handler);\n      },\n      (handler) => {\n        this.socket?.off(event, handler);\n      }\n    );\n  }\n}\n\n// usage\nthis.socketService.on("event1"); // Observable<string>\nthis.socketService.on("event2"); // Observable<number>\n')),(0,o.kt)("h2",{id:"fromfetch"},(0,o.kt)("inlineCode",{parentName:"h2"},"fromFetch()")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"fromFetch()")," is used to convert ",(0,o.kt)("inlineCode",{parentName:"p"},"Fetch API")," to ",(0,o.kt)("inlineCode",{parentName:"p"},"Observable"),". The usage is identical to that of ",(0,o.kt)("inlineCode",{parentName:"p"},"fetch()"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'// Fetch API\nfetch("https://jsonplaceholder.typicode.com/todos")\n  .then((response) => response.json())\n  .then((todos) => {\n    /*...*/\n  });\n\n// fromFetch()\n/**\n * output:\n * - next: [{...}, {...}]\n * - complete\n */\nfromFetch("https://jsonplaceholder.typicode.com/todos")\n  .pipe(switchMap((response) => response.json()))\n  .subscribe(observer);\n')),(0,o.kt)("p",null,"The main difference here is that ",(0,o.kt)("inlineCode",{parentName:"p"},"fetch()")," is ",(0,o.kt)("inlineCode",{parentName:"p"},"Promise")," based and is eager. As soon as we invoke ",(0,o.kt)("inlineCode",{parentName:"p"},"fetch()"),", a request will be made. ",(0,o.kt)("inlineCode",{parentName:"p"},"fromFetch()")," converts the request to ",(0,o.kt)("inlineCode",{parentName:"p"},"Observable")," and makes it lazy. The request ",(0,o.kt)("strong",{parentName:"p"},"will not")," be made until we call ",(0,o.kt)("inlineCode",{parentName:"p"},".subscribe()")," on ",(0,o.kt)("inlineCode",{parentName:"p"},"fromFetch()"),"."),(0,o.kt)("p",null,"But wait, don't we already have ",(0,o.kt)("inlineCode",{parentName:"p"},"from()")," for something like that? There is a ",(0,o.kt)("em",{parentName:"p"},"gotcha"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'from(fetch("https://jsonplaceholder.typicode.com/todos"));\n')),(0,o.kt)("p",null,"Notice that we haven't called ",(0,o.kt)("inlineCode",{parentName:"p"},".subscribe()")," and the request will still be made. This is because ",(0,o.kt)("inlineCode",{parentName:"p"},"fetch()")," invokes a Promise eagerly as mentioned above."),(0,o.kt)("h2",{id:"interval"},(0,o.kt)("inlineCode",{parentName:"h2"},"interval()")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"interval()")," creates an ",(0,o.kt)("inlineCode",{parentName:"p"},"Observable")," that emits integers from ",(0,o.kt)("inlineCode",{parentName:"p"},"0")," in a specified interval."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"/**\n * output:\n * - (1s) next: 0\n * - (2s) next: 1\n * - (3s) next: 2\n * - ...\n */\ninterval(1000).subscribe(observer);\n")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"interval()")," does not ",(0,o.kt)("inlineCode",{parentName:"p"},"complete")," on its own so we will need to ",(0,o.kt)("inlineCode",{parentName:"p"},"unsubscribe")," from ",(0,o.kt)("inlineCode",{parentName:"p"},"interval()")," manually."),(0,o.kt)("h2",{id:"timer"},(0,o.kt)("inlineCode",{parentName:"h2"},"timer()")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"timer()")," has two usages:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Create an ",(0,o.kt)("inlineCode",{parentName:"li"},"Observable")," that will emit number ",(0,o.kt)("inlineCode",{parentName:"li"},"0")," after a specified ",(0,o.kt)("strong",{parentName:"li"},"delay"),". This usage of ",(0,o.kt)("inlineCode",{parentName:"li"},"timer()")," will allow it to ",(0,o.kt)("inlineCode",{parentName:"li"},"complete")," itself."),(0,o.kt)("li",{parentName:"ul"},"Create an ",(0,o.kt)("inlineCode",{parentName:"li"},"Observable")," that will emit integers starting with ",(0,o.kt)("inlineCode",{parentName:"li"},"0")," after a specified ",(0,o.kt)("strong",{parentName:"li"},"delay"),", then will emit each value after a specified ",(0,o.kt)("strong",{parentName:"li"},"interval"),". This sounds similar to ",(0,o.kt)("inlineCode",{parentName:"li"},"interval()")," but there is a slight difference which we will explore in a bit. Because this second usage is like ",(0,o.kt)("inlineCode",{parentName:"li"},"interval()"),", it will not ",(0,o.kt)("inlineCode",{parentName:"li"},"complete")," on its own.")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"/**\n * output:\n * - (1s) next: 0\n * - complete\n */\ntimer(1000).subscribe(observer);\n\n/**\n * output:\n * - (1s) next: 0 (the first delay)\n * - (2s) next: 1 (1s interval)\n * - (3s) next: 2 (1s interval)\n * - ...\n */\ntimer(1000, 1000).subscribe(observer);\n")),(0,o.kt)("p",null,"So what's this ",(0,o.kt)("em",{parentName:"p"},"slight")," difference? We can pass ",(0,o.kt)("inlineCode",{parentName:"p"},"0")," as the first argument to ",(0,o.kt)("inlineCode",{parentName:"p"},"timer(0, 1000)")," and this effectively gives us an ",(0,o.kt)("inlineCode",{parentName:"p"},"Observable")," that emits ",(0,o.kt)("strong",{parentName:"p"},"right away")," then every ",(0,o.kt)("inlineCode",{parentName:"p"},"1s")," after that. ",(0,o.kt)("inlineCode",{parentName:"p"},"interval()")," alone cannot achieve this."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"/**\n * output:\n * - (immediate) next: 0\n * - (1s) next: 1 (1s interval)\n * - (2s) next: 2 (1s interval)\n * - ...\n */\ntimer(0, 1000).subscribe(observer);\n")),(0,o.kt)("h2",{id:"throwerror"},(0,o.kt)("inlineCode",{parentName:"h2"},"throwError()")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"throwError()")," creates an ",(0,o.kt)("inlineCode",{parentName:"p"},"Observable")," that, instead emits values, will throw an Error upon subscribe."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"/**\n * output:\n * - error: 'an error'\n */\nthrowError(\"an error\").subscribe(observer);\n")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"throwError()")," is usually used with operators that requires an ",(0,o.kt)("inlineCode",{parentName:"p"},"Observable")," as return value. Two main use-cases are:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"catchError()"),": After we handle an error from an ",(0,o.kt)("inlineCode",{parentName:"li"},"Observable"),", we can use ",(0,o.kt)("inlineCode",{parentName:"li"},"throwError()")," to forward this error to the next ",(0,o.kt)("inlineCode",{parentName:"li"},"ErrorHandler"))),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"obs.pipe(\n  catchError((err) => {\n    // handle error\n    showNotification(err.message);\n    // forward the error to the next ErrorHandler\n    return throwError(err);\n  })\n);\n")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"(switch|concat|merge)Map")," + ",(0,o.kt)("inlineCode",{parentName:"li"},"retryWhen()"),": This is an advanced use-case which we will explore further in ",(0,o.kt)("strong",{parentName:"li"},"Higher-order Operator")," post. The basic idea is we can use ",(0,o.kt)("inlineCode",{parentName:"li"},"throwError()")," to force ",(0,o.kt)("inlineCode",{parentName:"li"},"retryWhen()")," to occur which will ",(0,o.kt)("strong",{parentName:"li"},"retry")," the ",(0,o.kt)("inlineCode",{parentName:"li"},"Observable")," pipeline.")),(0,o.kt)("h2",{id:"defer"},(0,o.kt)("inlineCode",{parentName:"h2"},"defer()")),(0,o.kt)("p",null,"This will be the last Creation Function that we will explore in this section, and it is an interesting one. ",(0,o.kt)("inlineCode",{parentName:"p"},"defer()")," accepts an ",(0,o.kt)("inlineCode",{parentName:"p"},"ObservableFactory")," (aka a ",(0,o.kt)("inlineCode",{parentName:"p"},"Function")," that returns an ",(0,o.kt)("inlineCode",{parentName:"p"},"Observable"),") to create a ",(0,o.kt)("em",{parentName:"p"},"deferred")," version of the original ",(0,o.kt)("inlineCode",{parentName:"p"},"Observable"),". What's special is that ",(0,o.kt)("inlineCode",{parentName:"p"},"defer()")," will use ",(0,o.kt)("inlineCode",{parentName:"p"},"ObservableFactory")," to create a new ",(0,o.kt)("inlineCode",{parentName:"p"},"Observable")," for every new ",(0,o.kt)("inlineCode",{parentName:"p"},"Subscriber"),". Let's explore in the following example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const random$ = of(Math.random()); // create an Observable that emits random number\n\n/**\n * output:\n * - next: 0.4146530439875191\n * - complete\n */\nrandom$.subscribe(observer);\n/**\n * output:\n * - next: 0.4146530439875191\n * - complete\n */\nrandom$.subscribe(observer);\n/**\n * output:\n * - next: 0.4146530439875191\n * - complete\n */\nrandom$.subscribe(observer);\n")),(0,o.kt)("p",null,"We can see that ",(0,o.kt)("inlineCode",{parentName:"p"},"of()")," returns the same result for all 3 subscribers. Let's try the same thing with ",(0,o.kt)("inlineCode",{parentName:"p"},"defer()")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const deferredRandom$ = defer(() => of(Math.random()));\n\n/**\n * output:\n * - next: 0.27312186273281935\n * - complete\n */\ndeferredRandom$.subscribe(observer);\n/**\n * output:\n * - next: 0.7180321390218474\n * - complete\n */\ndeferredRandom$.subscribe(observer);\n/**\n * output:\n * - next: 0.9626312890837065\n * - complete\n */\ndeferredRandom$.subscribe(observer);\n")),(0,o.kt)("p",null,"With ",(0,o.kt)("inlineCode",{parentName:"p"},"defer()"),", we have 3 different results for 3 different subscribers. How does this help? Imagine you'd need to retry some ",(0,o.kt)("inlineCode",{parentName:"p"},"Observable")," pipeline and at the beginning of this pipeline, you'd have a comparison against a value that can change, ",(0,o.kt)("inlineCode",{parentName:"p"},"defer()")," makes sure that when the pipeline occurs (aka is ",(0,o.kt)("inlineCode",{parentName:"p"},"subscribed")," to), the comparison happens with the latest values."))}c.isMDXComponent=!0}}]);