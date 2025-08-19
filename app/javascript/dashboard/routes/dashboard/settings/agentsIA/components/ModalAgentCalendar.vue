<script>
import Modal from '../../../../../components/Modal.vue';

export default {
  name:"ModalAngentCalendar",
  components: { Modal },
  props:{
    onClose: {
      type: Function,
      default: () => { },
    }
  },
  data() {
    return {
      show: true,
    };
  },
  mounted() {
    window.addEventListener('message', this.handleGoogleAuthMessage);
  },
  beforeUnmount() {
    window.removeEventListener('message', this.handleGoogleAuthMessage);
  },
  methods: {
    loginWithGoogle() {
      window.open(
        'http://localhost:8080/api/auth/google',
        'googleLoginPopup',
        'width=500,height=600'
      );
    },
    handleGoogleAuthMessage(event) {
      if (event.origin !== 'http://localhost:8080') return;

      const { access_token, refresh_token } = event.data;

      if (!access_token) {
        console.warn('Mensaje recibido sin access_token');
        return;
      }
      console.log('✅ Access Token recibido en frontend:', access_token);
      console.log('🔁 Refresh Token recibido en frontend:', refresh_token);
    },
  },
};
</script>

<template>
  <Modal :show.sync="show" :on-close="onClose">
    <div class="flex flex-col h-auto overflow-auto">
      <woot-modal-header
        :header-title="$t('AGENTS_AI.CARDS.CALENDAR.NAME')"
        :header-content="$t('AGENTS_AI.CARDS.CALENDAR.DESCRIPTION')"
      />

      <div class="w-full flex justify-center my-5" >
        <woot-button
            class="button nice rounded-md"
            icon="add-circle"
            @click="loginWithGoogle"
          >
            {{ $t('AGENTS_AI.MODALS.CALENDAR.ADD_GOOGLE_ACOUNT') }}
          </woot-button>
      </div>

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
