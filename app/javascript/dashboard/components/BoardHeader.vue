<script setup>
const props = defineProps({
  pageTitle: {
    type: String,
    required: true,
  }
});
</script>

<template>
  <div
    class="flex items-center justify-between px-4 py-0"
  >
    <div class="flex max-w-[85%] justify-center items-center">
      <h1
        class="text-xl font-medium break-words truncate text-black-900 dark:text-slate-100"
        :title="pageTitle"
      >
        {{ pageTitle }}
      </h1>
    </div>
  </div>
</template>
