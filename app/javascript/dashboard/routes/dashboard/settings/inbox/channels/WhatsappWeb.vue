<script>
import PageHeader from '../../SettingsSubPageHeader.vue';
import axios from 'axios';
import { mapGetters } from 'vuex';
import { useAlert } from 'dashboard/composables';
import router from '../../../../index';

export default {
  components: {
    PageHeader,
  },
  data() {
    return {
      provider: 'whatsapp_cloud',
      qrCode: '',
      errorMessage: '',
      connectionState: 'Desconectado',
      phoneNumber: '',
      inboxName: '',
      sessionId: '',
      userId: '',
      isLoading: false,
      qrGenerated: false,
      qrScanned: false,
      qrImageLoaded: false,
      statusInterval: null,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: 'getCurrentUser',
      accountId: 'getCurrentAccountId',
    }),
  },
  methods: {
    sanitizeInput(event) {
      const input = event.target.value;
      const sanitized = input.replace(/[^a-zA-Z0-9_-]/g, '_');
      this.inboxName = sanitized;
    },

    async generateQR() {
      this.errorMessage = '';
      this.qrCode = '';
      this.qrImageLoaded = false;
      this.isLoading = true;
      this.qrScanned = false;

      if (!this.inboxName) {
        this.errorMessage = 'El nombre del inbox es requerido.';
        this.isLoading = false;
        return;
      }

      try {
        const payload = {
          instanceName: this.inboxName,
          integration: "WHATSAPP-BAILEYS",
          qrcode: true,
          chatwoot_account_id: this.accountId,
          chatwoot_token: this.currentUser.access_token,
          chatwoot_url: "https://easycontact.top",
          chatwoot_sign_msg: false,
          chatwoot_reopen_conversation: true,
          chatwoot_conversation_pending: true
        };

        const response = await axios.post(
          'http://34.41.191.74:3030/instance/create',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              'apikey': '429683C4C977415CAAFCCE10F7D57E11'
            }
          });

        if (response.data.qrcode) {
          this.qrCode = response.data.qrcode.base64;
          this.connectionState = 'QR generado';
          this.qrGenerated = true;
          this.startStatusPolling();
        } else {
          this.errorMessage = 'No se pudo obtener el código QR.';
        }
      } catch (error) {
        console.error('Error al generar QR:', error);
        useAlert(error.response?.data?.response?.message?.[0] || 'Error desconocido');
        this.errorMessage = 'Error al cargar el QR. Inténtalo nuevamente.';
      } finally {
        this.isLoading = false;
      }
    },
    async generateQR() {
      this.errorMessage = '';
      this.qrCode = '';
      this.qrImageLoaded = false;
      this.isLoading = true;
      this.qrScanned = false;

      if (!this.inboxName) {
        this.errorMessage = 'El nombre del inbox es requerido.';
        this.isLoading = false;
        return;
      }

      try {
        if (this.qrGenerated && !this.qrScanned) {
          const response = await axios.get(`http://34.41.191.74:3030/instance/connect/${this.inboxName}`, {
            headers: {
              'apikey': '429683C4C977415CAAFCCE10F7D57E11'
            }
          });

          if (response.data?.status === 'CONNECTED') {
            this.connectionState = 'Conectado';
            this.qrScanned = true;
            this.phoneNumber = response.data?.phone?.id || '';
            return;
          } else {
            this.qrCode = response.data.base64
            this.connectionState = 'Intentando reconectar...';
            this.startStatusPolling();
            return;
          }
        }

        const payload = {
          instanceName: this.inboxName,
          integration: "WHATSAPP-BAILEYS",
          qrcode: true,
          chatwoot_account_id: this.accountId,
          chatwoot_token: this.currentUser.access_token,
          chatwoot_url: "https://easycontact.top",
          chatwoot_sign_msg: false,
          chatwoot_reopen_conversation: true,
          chatwoot_conversation_pending: true
        };

        const response = await axios.post(
          'http://34.41.191.74:3030/instance/create',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              'apikey': '429683C4C977415CAAFCCE10F7D57E11'
            }
          });

        if (response.data.qrcode) {
          this.qrCode = response.data.qrcode.base64;
          this.connectionState = 'QR generado';
          this.qrGenerated = true;
          this.startStatusPolling();
        } else {
          this.errorMessage = 'No se pudo obtener el código QR.';
        }
      } catch (error) {
        console.error('Error al generar o reconectar QR:', error);
        useAlert(error.response?.data?.response?.message?.[0] || 'Error desconocido');
        this.errorMessage = 'Error al generar/reconectar QR. Inténtalo nuevamente.';
      } finally {
        this.isLoading = false;
      }
    },
    startStatusPolling() {
      if (this.statusInterval) clearInterval(this.statusInterval);

      this.statusInterval = setInterval(async () => {
        try {
          const res = await axios.get(`http://34.41.191.74:3030/instance/connectionState/${this.inboxName}`, {
            headers: {
              'apikey': '429683C4C977415CAAFCCE10F7D57E11'
            }
          });

          const data = res.data;

          if (data?.instance.state === 'open') {
            this.connectionState = 'Conectado';
            this.qrScanned = true;
            this.phoneNumber = data?.phone?.id || '';
            clearInterval(this.statusInterval);
            this.statusInterval = null;
          }
        } catch (err) {
          console.error('Error en polling de estado:', err);
        }
      }, 3000);
    },
    async createChannel() {
      try {
        const apiChannel = await this.$store.dispatch('inboxes/createChannel', {
          name: this.inboxName,
          channel: {
            type: 'api',
            webhook_url: `http://34.41.191.74:3030/chatwoot/webhook/${this.inboxName}`,
          },
        });
        router.replace({
          name: 'settings_inboxes_add_agents',
          params: {
            page: 'new',
            inbox_id: apiChannel.id,
          },
        });
      } catch (error) {
        useAlert(this.$t('INBOX_MGMT.ADD.API_CHANNEL.API.ERROR_MESSAGE'));
      }
    },
  },

  beforeDestroy() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
      this.statusInterval = null;
    }
  },
};
</script>

<template>
  <div class="border border-slate-25 dark:border-slate-800/60 bg-white dark:bg-slate-900 h-full p-6 w-full max-w-full md:w-3/4 md:max-w-[75%] flex-shrink-0 flex-grow-0">
    <PageHeader
      :header-title="$t('INBOX_MGMT.ADD.WHATSAPPWEB.TITLE')"
      :header-content="$t('INBOX_MGMT.ADD.WHATSAPPWEB.DESC')"
    />

    <div class="w-[65%] flex-shrink-0 flex-grow-0 max-w-[65%]">
      <label class="flex flex-col gap-2">
        <span>{{ $t('INBOX_MGMT.ADD.WHATSAPPWEB.INBOX_NAME.LABEL') }}:</span>
        <div class="flex gap-2">
          <input
            type="text"
            class="border p-2 rounded-md"
            :placeholder="$t('INBOX_MGMT.ADD.WHATSAPPWEB.INBOX_NAME.PLACEHOLDER')"
            v-model="inboxName"
            @input="sanitizeInput"
            required
          />
          <button
           v-if="!qrScanned"
            @click="generateQR"
            class="px-4 py-2 bg-green-600 text-white rounded"
            :disabled="isLoading"
          >
            <span>{{ qrGenerated && !qrScanned ? 'Reconectar QR' : 'Generar QR' }}</span>
          </button>

        </div>

        <span v-if="qrImageLoaded && connectionState !== 'Conectado'">Escanee el código QR:</span>
        <p v-if="isLoading">Cargando...</p>
        <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>

        <img
          v-if="qrCode && connectionState !== 'Conectado'"
          :src="qrCode"
          alt="Código QR"
          class="border p-2 rounded-md w-[300px] h-[300px]"
          @load="qrImageLoaded = true"
          @error="qrImageLoaded = false"
        />

        <p v-if="qrScanned" class="text-green-600 font-bold mt-2">QR Escaneado correctamente</p>
      </label>

      <div class="w-full mt-4">
        <button
          @click="createChannel"
          class="px-4 py-2 bg-green-600 text-white rounded"
          :disabled="!qrScanned"
        >
          Crear canal
        </button>
      </div>
    </div>
  </div>
</template>
