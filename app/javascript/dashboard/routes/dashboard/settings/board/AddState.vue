<script>
import { mapGetters } from 'vuex';
import validations, { getStateNameErrorMessage } from './validations';
import { getRandomColor } from 'dashboard/helper/labelColor';
import { useVuelidate } from '@vuelidate/core';
import { useAlert } from 'dashboard/composables';
export default {
  data(){
    return {
      color: '',
      name: ''
    }
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validations,
  computed: {
    ...mapGetters({
      uiFlags: 'kanbanState/getUIFlags',
    }),
    stateNameErrorMessage() {
      const errorMessage = getStateNameErrorMessage(this.v$);
      return this.$t(errorMessage);
    },
  },
  mounted() {
    this.color = getRandomColor();
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    async addState() {
      try {
        await this.$store.dispatch('kanbanState/create', {
          name: this.name.toLowerCase(),
          color: this.color,
        });
        useAlert(this.$t('BOARD.ADD.API.SUCCESS_MESSAGE'));
        this.onClose();
      } catch (error) {
        const errorMessage = error.message || this.$t('BOARD.ADD.API.ERROR_MESSAGE');
        useAlert(errorMessage);
      }
    },
  },
};
</script>

<template>
  <div class="flex flex-col h-auto overflow-auto">
    <woot-modal-header :header-title="$t('BOARD.ADD.TITLE')" :header-content="$t('BOARD.ADD.DESC')" />
    <form class="flex flex-wrap mx-0 w-full" @submit.prevent="addState">
      <woot-input 
        v-model.trim="name" 
        :class="{ error: v$.name.$error }" 
         class="w-full label-name--input"
        :label="$t('BOARD.FORM.NAME.LABEL')" 
        :placeholder="$t('BOARD.FORM.NAME.PLACEHOLDER')"
        :error="stateNameErrorMessage" data-testid="label-name"
         @input="v$.name.$touch" 
      />
      <div class="w-full">
        <label>
          {{ $t('BOARD.FORM.COLOR.LABEL') }}
          <woot-color-picker v-model="color" />
        </label>
      </div>
      <div class="flex items-center justify-end w-full gap-2 px-0 py-2">
        <woot-button 
          :is-disabled="v$.name.$invalid || uiFlags.isCreating"
          :is-loading="uiFlags.isCreating" 
          data-testid="label-submit"
        >
          {{ $t('BOARD.FORM.CREATE') }}
        </woot-button>
        <woot-button class="button clear" @click.prevent="onClose">
          {{ $t('BOARD.FORM.CANCEL') }}
        </woot-button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.label-name--input {
  ::v-deep {
    input {
      @apply lowercase;
    }
  }
}
</style>
