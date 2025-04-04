<script>
import { mapGetters } from 'vuex';
import { useAlert } from 'dashboard/composables';
import validations, { getSorterTitleErrorMessage,getSorterDescriptionErrorMessage } from './validations';
import { useVuelidate } from '@vuelidate/core';

export default {
  props: {
    selectedResponse: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      name: '',
      description: '',
      color: '',
    };
  },
  validations,
  computed: {
    ...mapGetters({
      uiFlags: 'sorter/getUIFlags',
    }),
    pageTitle() {
      return `${this.$t('SORTER.EDIT.TITLE')} - ${
        this.selectedResponse.name
      }`;
    },
    labelTitleErrorMessage() {
      const errorMessage = getSorterTitleErrorMessage(this.v$);
      return this.$t(errorMessage);
    },
    labelDescriptionErrorMessage() {
      const errorMessage = getSorterDescriptionErrorMessage(this.v$);
      return this.$t(errorMessage);
    },
  },
  mounted() {
    this.setFormValues();
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    setFormValues() {
      this.name = this.selectedResponse.name;
      this.description = this.selectedResponse.description;
      this.color = this.selectedResponse.color;
    },
    editLabel() {
      this.$store
        .dispatch('sorter/update', {
          id: this.selectedResponse.id,
          color: this.color,
          description: this.description,
          name: this.name.toLowerCase(),
        })
        .then(() => {
          useAlert(this.$t('SORTER.EDIT.API.SUCCESS_MESSAGE'));
          setTimeout(() => this.onClose(), 10);
        })
        .catch(() => {
          useAlert(this.$t('SORTER.EDIT.API.ERROR_MESSAGE'));
        });
    },
  },
};
</script>

<template>
  <div class="flex flex-col h-auto overflow-auto">
    <woot-modal-header :header-title="pageTitle" />
    <form class="flex flex-wrap mx-0" @submit.prevent="editLabel">
      <woot-input
        v-model.trim="name"
        :class="{ error: v$.name.$error }"
        class="w-full label-name--input"
        :label="$t('SORTER.FORM.NAME.LABEL')"
        :placeholder="$t('SORTER.FORM.NAME.PLACEHOLDER')"
        :error="labelTitleErrorMessage"
        @input="v$.name.$touch"
      />

      <woot-text-area
        v-model.trim="description"
        :class="{ error: v$.description.$error }"
        class="w-full"
        :label="$t('SORTER.FORM.DESCRIPTION.LABEL')"
        :placeholder="$t('SORTER.FORM.DESCRIPTION.PLACEHOLDER')"
        data-testid="label-description"
        @input="v$.description.$touch"
        :error="labelDescriptionErrorMessage"
      />

      <div class="w-full">
        <label>
          {{ $t('SORTER.FORM.COLOR.LABEL') }}
          <woot-color-picker v-model="color" />
        </label>
      </div>
      <div class="flex items-center justify-end w-full gap-2 px-0 py-2">
        <woot-button
          :is-disabled="v$.name.$invalid ||  v$.description.$invalid || uiFlags.isUpdating"
          :is-loading="uiFlags.isUpdating"
        >
          {{ $t('SORTER.FORM.EDIT') }}
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
