# Strapi Flatten GraphQL

Helper to flatten nested strapi v4 graphql structure including typings. I use this in my project where I also
use `graphql-codegen` to generate typings and services from schema but it should also work with the code first approach.
Currently to make use of it the graphql query needs to always request entity `id` on any level.

I'll be happy to accept any PRs that will make this more useful and generic.


A utility library to flatten nested GraphQL responses from Strapi into simpler structures.

## Installation

```bash
npm install strapi-flatten-graphql
```

## Usage

This library provides functions to flatten nested GraphQL responses from Strapi. Here's how to use them:

### `flattenEntity(entity: StrapiEntity): FlattenEntity<StrapiEntity>`

This function takes a Strapi entity and returns a flattened version of it. The entity should have an `id` and `attributes` field. The `attributes` field can be an object containing nested fields.

Example:

```javascript
import { flattenEntity } from 'strapi-flatten-graphql';

const entity = {
  id: '1',
  attributes: {
    name: 'John',
    age: 30,
    address: {
      city: 'New York',
      country: 'USA',
    },
  },
};

const flattenedEntity = flattenEntity(entity);

console.log(flattenedEntity);
/*
{
  id: '1',
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    country: 'USA',
  },
}
*/
```

### `flattenEntityResponse(response: StrapiEntityResponse): Flatten<StrapiEntityResponse>`

This function takes a Strapi entity response and returns a flattened version of it. The response should have a `data` field containing the entity.

Example:

```javascript
import { flattenEntityResponse } from 'strapi-flatten-graphql';

const response = {
  data: {
    id: '1',
    attributes: {
      name: 'John',
      age: 30,
      address: {
        city: 'New York',
        country: 'USA',
      },
    },
  },
};

const flattenedResponse = flattenEntityResponse(response);

console.log(flattenedResponse);
/*
{
  id: '1',
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    country: 'USA',
  },
}
*/
```

### `flattenEntityResponseCollection(response: StrapiEntityResponseCollection): FlattenArray<StrapiEntityResponseCollection>`

This function takes a collection of Strapi entity responses and returns a flattened version of it. The response should have a `data` field containing an array of entities.

Example:

```javascript
import { flattenEntityResponseCollection } from 'strapi-flatten-graphql';

const response = {
  data: [
    {
      id: '1',
      attributes: {
        name: 'John',
        age: 30,
        address: {
          city: 'New York',
          country: 'USA',
        },
      },
    },
    {
      id: '2',
      attributes: {
        name: 'Jane',
        age: 25,
        address: {
          city: 'San Francisco',
          country: 'USA',
        },
      },
    },
  ],
};

const flattenedResponse = flattenEntityResponseCollection(response);

console.log(flattenedResponse);
/*
[
  {
    id: '1',
    name: 'John',
    age: 30,
    address: {
      city: 'New York',
      country: 'USA',
    },
  },
  {
    id: '2',
    name: 'Jane',
    age: 25,
    address: {
      city: 'San Francisco',
      country: 'USA',
    },
  },
]
*/
```

## API Reference

### Types

- `StrapiEntity`: Represents a Strapi entity with an `id` and `attributes` field.
- `StrapiEntityResponse<N>`: Represents a Strapi entity response with a `data` field containing a single entity.
- `StrapiEntityResponseCollection<N>`: Represents a collection of Strapi entity responses with a `data` field containing an array of entities.
- `FlattenStrapi<T>`: Type utility to flatten nested GraphQL responses based on the input type `T`.
- `FlattenEntity<E extends StrapiEntity>`: Type utility to flatten a single entity.
- `Flatten<T extends StrapiEntityResponse>`: Type utility to flatten a single entity response.
- `FlattenArray<T extends StrapiEntityResponseCollection>`: Type utility to flatten an entity response collection.
- `FlattenAttributes<T>`: Type utility to flatten the attributes of an entity.

### Functions

- `flattenEntity(entity: StrapiEntity): FlattenEntity<StrapiEntity>`: Flattens a Strapi entity.
- `flattenEntityResponse(response: StrapiEntityResponse): Flatten<StrapiEntityResponse>`: Flattens a Strapi entity response.
- `flattenEntityResponseCollection(response: StrapiEntityResponseCollection): FlattenArray<StrapiEntityResponseCollection>`: Flattens a collection of Strapi entity responses.

## License

This project is licensed under the MIT License.

Feel free to reach out if you have any questions or need further assistance!