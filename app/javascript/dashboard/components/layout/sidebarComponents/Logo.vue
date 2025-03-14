<script>
import { frontendURL } from 'dashboard/helper/URLHelper';

export default {
  props: {
    source: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    accountId: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    dashboardPath() {
      return frontendURL(`accounts/${this.accountId}/dashboard`);
    },
  },
};
</script>

<template>
  <div class="w-8 h-8">
    <router-link :to="dashboardPath" replace>
      <img :src="source" :alt="name" class="shadow-filter-logo"/>
    </router-link>
  </div>
</template>

<style>
.shadow-filter-logo{
  filter: drop-shadow(0px 0px 2px #22223455);
}
</style>
