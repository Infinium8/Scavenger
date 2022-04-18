# Scavenger

⚡️ A lightning-fast static resource search library for React.

## Navigation

- [Live demo](https://codesandbox.io/s/scavenger-o44bxn)
- [Demo GIF](https://codeberg.org/athena/Scavenger/media/branch/main/scavenger.gif)
- [Documentation](https://codeberg.org/athena/Scavenger#documentation)
    - [`ScavengerProvider`](https://codeberg.org/athena/Scavenger#the-scavengerprovider)
    - [`useScavenger`](https://codeberg.org/athena/Scavenger#usescavenger-query-string-scope-string-options-options)
    - [Dynamically populate resources](https://codeberg.org/athena/Scavenger#loadresources-resources-any-merge-boolean-true)
    - [Specialized sorting](https://codeberg.org/athena/Scavenger#sortobjectsinspecificorder-results-any-order-string-type-string)
- [FAQs](https://codeberg.org/athena/Scavenger#faqs)

## Features

- Initially populate searchable resources and/or add some on-the-fly.
- Display a static list of suggestions when the query is empty.
- Hook right into an input's value state and get instant results.
- Declare Schemas for your data so that only certain properties are searchable.
- Create multiple search components that all hook into the same resource pool.
- Search within nested data types.

**Note:** FAQs are at the end of this document.

## Installation

```bash
yarn add @infinium/scavenger
```

or

```bash
npm install @infinium/scavenger
```

## Usage at a Glance

1. Create `Schema`s that define searchable properties in your data.
2. Load resources to be searched at any point in time via the `ScavengerProvider`.
3. Display the results with the `useScavenger` hook.
4. (Optional) Load resources via an `async` function later.

## Understanding vs. Boilerplate Code

The README contains the knowledge you'll need to use Scavenger properly. Before doing anything else, you should read it entirely.

If you've already read it and just want drop-in boilerplate code, visit the [wiki.](https://codeberg.org/athena/Scavenger/wiki)

## Documentation

### Basic Understanding

Scavenger doesn't work like Google or other search engines. The suggestions are derived from **static** resources. That is, no HTTP requests are made. This is what gives Scavenger the ability to be so-called "lightning-fast."

Don't worry, you don't have to know ahead-of-time all of your searchable resources. You can add some later on-the-fly.

Just to give you an idea of what I'm talking about, here's a brief explanation of the terms I use to describe certain types of data.

**Resources** are JavaScript objects that must contain, at minimum, a property `type` (this can be changed). These are the "searchable" resources. They could be, for instance, User objects or Article objects. They're just the data you want searched. They **must be an object**, however.

A **resource pool** is just an array of resources.

**Schemas** are JavaScript objects, too, but they declare searchable properties that exist on **Resources.** In reality, you only ever declare one Schema, but it itself declares properties for multiple types of objects.

### Learning Scavenger

If you're into more "interactive" documentation, this [code-oriented Codesandbox tutorial might be desirable.](https://codesandbox.io/s/scavenger-nzxwu)

If you're not into CodeSandbox or if you prefer reading English instead, below I explain the API and how to use it (probably with a better understanding than the sandbox, really).

### The `ScavengerProvider`

Many websites like to have multiple search components throughout their website in different contexts. Since it'd be tedious to constantly be importing and initializing Scavenger for each one, Scavenger exports the `ScavengerProvider` component. This wraps a part of your application and allows the resources to be shared across each of the hook instances.

If you're wondering how to have different hook instances search for different objects, see the `useScavenger` section below.

The provider accepts a few parameters, all of which are explained below:

#### `initialResources: any[]`

This is an array of JS objects that act as your initial array of static resources. At minimum, each object needs to have a `type` property that is equal to the name of the Schema object you use.

For demonstration, I'll be talking about an array of `Language`s. The `Language` object looks like:

```json
{
    "type": "Language",
    "name": "TypeScript"
}
```

The `type` property is special here. It is what the `Schema` uses and therefore what allows Scavenger to find this resource.

> What if I already have a `type` property in my data?

You can change this in the hook, which is explained below.

It's not required to pass anything to this prop if you don't want to.

#### `suggestions: any[]`

This is an array of objects that are suggested when the query is an empty string. If left empty, this will default to your `initialResources`, so **make sure to add some here.**

#### `schema: Schema`

This is the primary Schema object that declares the type of all searchable resources, and what properties to search for from within those objects.

Note: It's standard practice to capitalize Schema types.

Let's look at an example. Assume we have the following data:

```js
const resources = [
    {
        id: 'a76ed3a5-9ed9-46e3-a67c-fbdac6035c20',
        auth_token: 'ffa4ddf73fb1cd262e5f252b25983898b3c8cad34938af6fd2b11da4c5d6a026',
        type: 'User',
        username: 'sholmes',
        full_name: 'Sherlock Holmes',
        plan: 'premium',
    },
];
```

Right now, we want users to be able to search by `username` and `first_name`, but not `id`, `auth_token`, `plan`, or `type`.

To do this, we declare a Schema that defines the properties we want searchable.

Let's do that now.

```js
const Schema = {
    User: ['username', 'first_name'],
}
```

Great! Now all we have to do is make sure our data conforms to this Schema.

So, how does Scavenger know what resources are of what type? Notice the `type: 'User'` value in the above code. The `Schema`s keys are the values of the `type` property.

### `useScavenger(query: string, scope: string, options: Options)`

This is the primary hook you'll be using.

Basic usage looks like:

```js
const [query, setQuery] = useState('');
const scavenger = useScavenger(query, scope, {
    sortBy: 'name',
    id: 'type',
});
```

### Parameters

The hook accepts three parameters: `query`, `scope`, and `options`.

`query` is understandably the string the user is searching for.

`scope` is how you can limit the results by the `type` property. `scope` defaults to `root` which is all of your resources.

Options is an object with the following properties:

```js
interface Options {
    sortBy: string;
    id: string;
}
```

**`sortBy`** is the string name of a property on your objects that you want to sort by. For instance, you could sort by the title or description. It defaults to "name". The value attached to this property **must** be a string.

**`id`** is the property name that distinguishes some resources from others. This is the Schema type/property we're talking about. It defaults to `type`, which we recommend; if you must change it, you can. You cannot, however, declare this value globally. You must do it manually for each hook instance.

### Returns

The returned object (`scavenger`) gives us a few things:

#### `results: any[]`

This is, as you'd expect, an array of the results returned from the search. It returns an array of objects that you passed in, **not just the properties you declare in your `Schema`.**

#### `loadResources(resources: any[], merge: boolean = true)`

This is a function that allows you to dynamically add resources to be searched. By default, resources are merged with the ones you initially passed into the provider, but this behavior can be disabled if you want to overwrite the resources.

```js
// This will merge the empty array with the
// initialResources you gave the provider.
scavenger.loadResources([]);

// This will overwrite the resources to an
// empty array.
scavenger.loadResources([], false);
```

#### `resources: any[]`

Just in case you need access to the entire array of resources, it's exported.

## Other API values

### `sortObjectsInSpecificOrder(results: any[], order: string[], type: string)`

When I've used Scavenger on my personal websites, I've often found myself wanting certain types of results to show up before others. For instance, I often want Pages to be first, and other items to be second.

For these purposes, we can use the new `sortObjectsInSpecificOrder` function. It does not integrate into the hook, but it can act as a wrapper for the results in the following way:

```jsx
import { useScavenger, sortObjectsInSpecificOrder } from '@infinium/scavenger';

const MyComponent = () => {
    const scavenger = useScavenger(query, 'root', {
        sortBy: 'title'
    });

    const order = ['Page', 'Article', 'Project'];

    return (
        <>
            {sortObjectsInSpecificOrder(scavenger.results, order, 'type')}
        </>
    );
}
```

With this, the output of the results will be sorted in the order we specified in the `order` array. That is, `Page`s will always be first, followed by `Article`s and `Project`s.

Note that this doesn't override the default `sortBy` value. The results will first be sorted by `title`, then sorted again by `type`. This means that within each `type`, the results will be alphabetically sorted. This is usually the desired approach.

## FAQs

> How can I increase the relevancy of the results?

We're working on a more intelligent way to get search results that won't require direct modification of your data. In the meantime, the best way to make your results more accurate is to add more data to your resources.


The best way to do so is just to create properties with an array of tags that are all similar in some way to the primary object.

For instance, let's assume we have this Resource:

```js
const resource = {
    id: 'blahblahblah',
    title: 'Write Maintainable Code the First Time',
    description: "Maintainability is a major aspect of programming. Get it right and you'll be worry-free. Get it wrong, however...",
}
```

What if someone types "clean code" in your search area? Well, it won't be found, because that doesn't exist on the resource. What you can do to compensate for this is add some other helper properties to the resource that make the vector of discovery much wider.

Compare the above resource to:

```js
const resource = {
    id: 'blahblahblah',
    title: 'Write Maintainable Code the First Time',
    description: "Maintainability is a major aspect of programming. Get it right and you'll be worry-free. Get it wrong, however...",
    tags: ['clean code', 'good code', 'code'],
}
```

Assuming we add `tags` to our Schema, now the resource will be found for more queries.


## License

This project is licensed under the terms of the MIT license.

Copyright 2022-present Infinium LLC. All rights reserved.
