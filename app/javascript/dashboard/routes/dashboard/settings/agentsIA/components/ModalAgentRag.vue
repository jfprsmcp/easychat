<script>
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';

import WootSubmitButton from '../../../../../components/buttons/FormSubmitButton.vue';
import Modal from '../../../../../components/Modal.vue';
import WootMessageEditor from 'dashboard/components/widgets/WootWriter/Editor.vue';

export default {
  components: {
    WootSubmitButton,
    Modal,
    WootMessageEditor,
  },
  props: {
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
      show: true,
      file: null,
    };
  },
  validations: {
    file: {
      required
    },
  },
  methods: {
     onFileChange(event) {
      const file = event.target.files[0]
      if (file && file.type === 'application/pdf') {
        this.file = file
      } else {
        this.file = null
        alert('Solo se permiten archivos PDF')
      }
    },
    submitFile() {
      if (this.file) {
        console.log('Datos del archivo:', {
          nombre: this.file.name,
          tamaño: this.file.size,
          tipo: this.file.type,
          fecha: this.file.lastModifiedDate,
        })
      }
    }
  },
};
</script>

<template>
  <Modal :show.sync="show" :on-close="onClose">
    <div class="flex flex-col h-auto overflow-auto">
      <woot-modal-header :header-title="$t('AGENTS_AI.CARDS.RAG.NAME')"
        :header-content="$t('AGENTS_AI.CARDS.RAG.DESCRIPTION')" />
      <form class="flex w-full" @submit.prevent="submitFile()">
        <div class="flex flex-col">
          <label>
            {{ $t('AGENTS_AI.CARDS.RAG.FORM.LABEL_FILE') }}
            <input type="file" accept=".pdf" multiple/>
          </label>
        </div>

        <div class="flex flex-row justify-end w-full gap-2 px-0 py-2">
          <WootSubmitButton :disabled="!file" :button-text="$t('AGENTS_AI.CARDS.RAG.FORM.SUBMIT')" :loading="true" />
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
