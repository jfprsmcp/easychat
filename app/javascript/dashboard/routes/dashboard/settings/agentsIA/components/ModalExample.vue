<script>
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';

import WootSubmitButton from '../../../../components/buttons/FormSubmitButton.vue';
import Modal from '../../../../components/Modal.vue';
import WootMessageEditor from 'dashboard/components/widgets/WootWriter/Editor.vue';

export default {
  components: { WootSubmitButton, Modal, WootMessageEditor },
  props: {
    responseContent: {
      type: String,
      default: '',
    },
    onClose: {
      type: Function,
      default: () => { },
    },
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      shortCode: '',
      content: this.responseContent || '',
      addCanned: {
        showLoading: false,
        message: '',
      },
      show: true,
    };
  },
  validations: {
    shortCode: {
      required,
      minLength: minLength(2),
    },
    content: {
      required,
    },
  },
  methods: {
    resetForm() {
      this.shortCode = '';
      this.content = '';
      this.v$.shortCode.$reset();
      this.v$.content.$reset();
    },
    addCannedResponse() {
      // Show loading on button
      // this.addCanned.showLoading = true;
      // Make API Calls

      console.log('shortCode', this.shortCode)
      console.log('content', this.content)


      //   this.$store
      //     .dispatch('createCannedResponse', {
      //       short_code: this.shortCode,
      //       content: this.content,
      //     })
      //     .then(() => {
      //       // Reset Form, Show success message
      //       this.addCanned.showLoading = false;
      //       useAlert(this.$t('CANNED_MGMT.ADD.API.SUCCESS_MESSAGE'));
      //       this.resetForm();
      //       this.onClose();
      //     })
      //     .catch(error => {
      //       this.addCanned.showLoading = false;
      //       const errorMessage =
      //         error?.message || this.$t('CANNED_MGMT.ADD.API.ERROR_MESSAGE');
      //       useAlert(errorMessage);
      //     });
    },
  },
};
</script>

<template>

  <!--? Open Button -->
  <!-- <woot-modal :show.sync="showAgentRag" :on-close="hideAgentRag">
      <AgentRag :on-close="hideAgentRag" />
    </woot-modal> -->
  <!--? Open Button -->


  <Modal :show.sync="show" :on-close="onClose">
    <div class="flex flex-col h-auto overflow-auto">
      <woot-modal-header :header-title="$t('AGENTS_AI.CARDS.RAG.NAME')"
        :header-content="$t('AGENTS_AI.CARDS.RAG.DESCRIPTION')" />
      <form class="flex flex-col w-full" @submit.prevent="addCannedResponse()">
        <div class="w-full">
          <label :class="{ error: v$.shortCode.$error }">
            {{ $t('AGENTS_AI.CARDS.RAG.FORM.LABEL_COLLECTION') }}
            <input v-model.trim="shortCode" type="text"
              :placeholder="$t('AGENTS_AI.CARDS.RAG.FORM.PLACEHOLDER_COLLECTION')" @input="v$.shortCode.$touch" />
          </label>
        </div>

        <div class="w-full">
          <label>
            {{ $t('AGENTS_AI.CARDS.RAG.FORM.LABEL_FILE') }}
            <!-- <input type="file" accept=".pdf" multiple @change="handleFileUpload" /> -->
            <input type="file" accept=".pdf" multiple />
          </label>
        </div>



        <div class="flex flex-row justify-end w-full gap-2 px-0 py-2">
          <WootSubmitButton :disabled="v$.content.$invalid ||
            v$.shortCode.$invalid ||
            addCanned.showLoading
            " :button-text="$t('AGENTS_AI.CARDS.RAG.FORM.SUBMIT')" :loading="addCanned.showLoading" />
          <button class="button clear" @click.prevent="onClose">
            {{ $t('CANNED_MGMT.ADD.CANCEL_BUTTON_TEXT') }}
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<style scoped lang="scss">
::v-deep {
  .ProseMirror-menubar {
    @apply hidden;
  }

  .ProseMirror-woot-style {
    @apply min-h-[12.5rem];

    p {
      @apply text-base;
    }
  }
}
</style>
