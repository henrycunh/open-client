<script lang="ts" setup>
import { defineClient } from 'api:petstore'

const client = defineClient({
  baseURL: 'https://petstore.swagger.io/v2',
})

const { data: pets } = await client('/pet/findByStatus', 'get')({ 
  query: { status: ['available', 'sold', 'pending'] } 
})

</script>

<template>
  <div>
    {{ pets }}
  </div>
</template>
