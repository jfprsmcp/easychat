<script>
import { frontendURL } from 'dashboard/helper/URLHelper';
import { mapGetters } from 'vuex';

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
    ...mapGetters({
      getAccount: 'accounts/getAccount',
    }),
    account() {
      return this.getAccount(this.accountId);
    },
    dashboardPath() {
      return frontendURL(`accounts/${this.accountId}/dashboard`);
    },
  },
  methods: {
    loadImagenDefault(event){
        event.target.src = '/LandingPage/LogoEasyContact.png';
    }
  }
};
</script>

<template>
  <div class="w-8 h-8">
    <router-link :to="dashboardPath" replace>
        <img @error="loadImagenDefault" :src="account.logo" alt="logo company" class="shadow-filter-logo"/>
    </router-link>
  </div>
</template>

<style>
.shadow-filter-logo{
  filter: drop-shadow(0px 0px 2px #22223455);
}
</style>
