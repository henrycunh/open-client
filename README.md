# open-client

[![npm](https://img.shields.io/npm/v/vite-plugin-open-client.svg)](https://www.npmjs.com/package/vite-plugin-open-client)

> Provides a fully typed HTTP client based on a OpenAPI specification

&nbsp;

### install
```
pnpm i -D vite-plugin-open-client
```

### use it

##### `vite.config.ts`
```ts
import OpenClient from 'vite-plugin-open-client'

export default {
    plugins: [
        OpenClient({
            definition: 'https://petstore.swagger.io/v2/swagger.json',
            apiName: 'petstore'
        })
    ]
}
```

##### `main.ts`
```ts
import { defineClient } from 'api:petstore'
import type { APISchema } from 'api:petstore'

const client = defineClient({
    baseUrl: 'https://api.petstore.com/',
    headers: {
        Apikey: 'my-api-key'
    }
})

// You can either alias the operations
const getPetById = client('/pet/{petId}', 'get')
const createPet = client('/pet', 'post')
console.log(
  await getPetById({ 
    path: { petId: 1 } 
    })
)

// You can borrow type definitions from the specification
const pet: APISchema<'Pet'> = {
  name: 'dog',
  photoUrls: ['https://example.com/dog.jpg'],
}
await createPet({ body: { body: pet }})

// Or call them directly through path
await client('/pet/{petId}', 'delete')({ 
  path: { petId: 1 } 
})


```
