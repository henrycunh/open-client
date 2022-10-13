<script lang="ts" setup>
import { defineClient, definitions } from 'api:petstore'

const client = defineClient()

// client('/pet/{petId}', 'get')({ path: { petId: 1 } })
</script>

<template>
  <div>
    {{ client }}
  </div>
</template>
