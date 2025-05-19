<script>
import { mapGetters } from 'vuex';
import { useAlert } from 'dashboard/composables';
import validations, { getStateNameErrorMessage } from './validations';
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
      color: '',
    };
  },
  validations,
  computed: {
    ...mapGetters({
      uiFlags: 'kanbanState/getUIFlags',
    }),
    pageTitle() {
      return `${this.$t('BOARD.EDIT.TITLE')} - ${
        this.selectedResponse.name
      }`;
    },
    labelNameErrorMessage() {
      const errorMessage = getStateNameErrorMessage(this.v$);
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
      this.color = this.selectedResponse.color;
    },
    editLabel() {
      this.$store.dispatch('kanbanState/update', {
        id: this.selectedResponse.id,
        color: this.color,
        name: this.name,
      }).then(() => {
        useAlert(this.$t('BOARD.EDIT.API.SUCCESS_MESSAGE'));
        setTimeout(() => this.onClose(), 10);
      }).catch(() => {
        useAlert(this.$t('BOARD.EDIT.API.ERROR_MESSAGE'));
      });
    },
  },
};
</script>

<template>
  <div class="flex flex-col h-auto overflow-auto">
    <woot-modal-header :header-title="pageTitle" />
    <form class="flex flex-wrap mx-0 w-full" @submit.prevent="editLabel">
      <woot-input
        v-model.trim="name"
        :class="{ error: v$.name.$error }"
        class="w-full"
        :label="$t('BOARD.FORM.NAME.LABEL')"
        :placeholder="$t('BOARD.FORM.NAME.PLACEHOLDER')"
        :error="labelNameErrorMessage"
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
          :is-disabled="v$.name.$invalid || uiFlags.isUpdating"
          :is-loading="uiFlags.isUpdating"
        >
          {{ $t('BOARD.FORM.EDIT') }}
        </woot-button>
        <woot-button class="button clear" @click.prevent="onClose">
          {{ $t('BOARD.FORM.CANCEL') }}
        </woot-button>
      </div>
    </form>
  </div>
</template>