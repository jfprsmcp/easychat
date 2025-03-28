<script>
import Spinner from 'shared/components/Spinner.vue';

export default {
  components: {
    Spinner,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    buttonText: {
      type: String,
      default: '',
    },
    buttonClass: {
      type: String,
      default: '',
    },
    iconClass: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'submit',
    },
  },
  computed: {
    computedClass() {
      return `
        ${this.disabled ? 'opacity-40 hover:bg-woot-500' : ''}
        ${this.buttonClass || ' '}
      `;
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
  },
};
</script>

<template>
  <button
    :type="type"
    data-testid="submit_button"
    :disabled="disabled"
    :class="computedClass"
    class="flex items-center w-full justify-center rounded-md bg-woot-dark py-3 px-3 text-base font-medium text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-woot-500 cursor-pointer"
    @click="onClick"
  >
    <span>{{ buttonText }}</span>
    <fluent-icon v-if="!!iconClass" :icon="iconClass" class="icon" />
    <Spinner v-if="loading" />
  </button>
</template>

<style>
  .bg-woot-dark {
      --tw-bg-opacity: 1;
      transition: background-color 0.3s ease-in-out;
      background-color: rgb(8 110 182 / var(--tw-bg-opacity, 1));
  }

  .bg-woot-dark:hover {
      --tw-bg-opacity: 0.8;
      transition: background-color 0.3s ease-in-out;
      background-color: rgb(8 110 182 / var(--tw-bg-opacity, 1));
  }
</style>