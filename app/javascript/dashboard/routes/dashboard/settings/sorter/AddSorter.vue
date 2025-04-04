<script>
import { mapGetters } from 'vuex';
import validations, { getSorterTitleErrorMessage, getSorterDescriptionErrorMessage } from './validations';
import { getRandomColor } from 'dashboard/helper/labelColor';
import { useVuelidate } from '@vuelidate/core';
import { useAlert } from 'dashboard/composables';
export default {
  props: {
    prefillTitle: {
      type: String,
      default: '',
    },
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      color: '#000',
      description: '',
      name: ''
    };
  },
  validations,
  computed: {
    ...mapGetters({
      uiFlags: 'sorter/getUIFlags',
    }),
    sorterTitleErrorMessage() {
      const errorMessage = getSorterTitleErrorMessage(this.v$);
      return this.$t(errorMessage);
    },
    sorterDescriptionErrorMessage() {
      const errorMessage = getSorterDescriptionErrorMessage(this.v$);
      return this.$t(errorMessage);
    },
  },
  mounted() {
    this.color = getRandomColor();
    this.name = this.prefillTitle.toLowerCase();
    this.description = '';
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    async addSorter() {
      console.log({
        color: this.color,
        description: this.description,
        name: this.name.toLowerCase()
      })
      try {
        await this.$store.dispatch('sorter/create', {
          color: this.color,
          description: this.description,
          name: this.name.toLowerCase()
        });
        useAlert(this.$t('SORTER.ADD.API.SUCCESS_MESSAGE'));
        this.onClose();
      } catch (error) {
        const errorMessage = error.message || this.$t('SORTER.ADD.API.ERROR_MESSAGE');
        useAlert(errorMessage);
      }
    },
  },
};
</script>

<template>
  <div class="flex flex-col h-auto overflow-auto">
    <woot-modal-header :header-title="$t('SORTER.ADD.TITLE')" :header-content="$t('SORTER.ADD.DESC')" />
    <form class="flex flex-wrap mx-0" @submit.prevent="addSorter">
      <woot-input v-model.trim="name" :class="{ error: v$.name.$error }" class="w-full label-name--input"
        :label="$t('SORTER.FORM.NAME.LABEL')" :placeholder="$t('SORTER.FORM.NAME.PLACEHOLDER')"
        :error="sorterTitleErrorMessage" data-testid="label-title" @input="v$.name.$touch" />

      <woot-text-area v-model.trim="description" :class="{ error: v$.description.$error }" class="w-full"
        :label="$t('SORTER.FORM.DESCRIPTION.LABEL')" :placeholder="$t('SORTER.FORM.DESCRIPTION.PLACEHOLDER')"
        data-testid="label-description" @input="v$.description.$touch" :error="sorterDescriptionErrorMessage" />

      <div class="w-full">
        <label>
          {{ $t('SORTER.FORM.COLOR.LABEL') }}
          <woot-color-picker v-model="color" />
        </label>
      </div>
      <div class="flex items-center justify-end w-full gap-2 px-0 py-2">
        <woot-button :is-disabled="v$.name.$invalid || v$.description.$invalid || uiFlags.isCreating"
          :is-loading="uiFlags.isCreating" data-testid="label-submit">
          {{ $t('SORTER.FORM.CREATE') }}
        </woot-button>
        <woot-button class="button clear" @click.prevent="onClose">
          {{ $t('SORTER.FORM.CANCEL') }}
        </woot-button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
// Label API supports only lowercase letters
.label-name--input {
  ::v-deep {
    input {
      @apply lowercase;
    }
  }
}
</style>
