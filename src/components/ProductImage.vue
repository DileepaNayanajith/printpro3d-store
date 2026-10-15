<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ src: string; alt: string; eager?: boolean }>()
const failed = ref(false)
watch(() => props.src, () => { failed.value = false })
</script>
<template>
  <img :src="failed ? '/products/image-unavailable.svg' : src" :alt="failed ? `${alt} — photo unavailable` : alt" :loading="eager ? 'eager' : 'lazy'" :fetchpriority="eager ? 'high' : 'auto'" decoding="async" @error="failed = true" />
</template>
