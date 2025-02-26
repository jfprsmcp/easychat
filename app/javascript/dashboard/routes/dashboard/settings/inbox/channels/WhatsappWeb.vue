<script>
import PageHeader from '../../SettingsSubPageHeader.vue';
import axios from 'axios';

export default {
  components: {
    PageHeader,
  },
  data() {
    return {
      provider: 'whatsapp_cloud',
      qrCodeUrl: '', // Almacena la URL del QR
      errorMessage: '', // Mensaje de error
      connectionState: 'Desconectado', // Estado de la conexión
      phoneNumber: '', // Número de WhatsApp conectado
      inboxName: '', // Variable para el nombre del inbox (inicializado vacío)
      sessionId: '', // Session ID (opcional)
      userId: '', // User ID (opcional)
    };
  },
  methods: {
    async fetchQRCode() {
      try {
        if (this.qrCodeUrl) return; // Evita llamadas duplicadas

        const response = await axios.get('http://localhost:8181/generate-qr');
        if (response.data.qr) {
          this.qrCodeUrl = response.data.qr;
        } else {
          this.errorMessage = 'No se pudo obtener el código QR.';
        }
      } catch (error) {
        console.error('Error al obtener el QR:', error);
        this.errorMessage = 'Error al cargar el QR. Inténtalo nuevamente.';
      }
    },
    async fetchConnectionStatus() {
      try {
        const response = await axios.get('http://localhost:8181/status');
        const data = response.data;
        this.connectionState = data.status || 'Desconectado';
        this.phoneNumber = data.phoneNumber || '';
        this.inboxName = data.inboxName || ''; // Asignar el nombre del inbox (vacío si no hay valor)
        this.sessionId = data.sessionId || ''; // Asignar el Session ID
        this.userId = data.userId || ''; // Asignar el User ID
      } catch (error) {
        console.error('Error al obtener el estado de conexión:', error);
        this.connectionState = 'Error';
      }
    },
    showConnectionStatus() {
      // Mostrar la información de la conexión en un alert con los datos correctos
      alert(`Estado de conexión: ${this.connectionState}\n` +
            `Número de teléfono: ${this.phoneNumber}\n` +
            `Nombre del inbox: ${this.inboxName}\n` +
            `Session ID: ${this.sessionId}\n` +
            `User ID: ${this.userId}`);
    },
  },
  mounted() {
    this.fetchQRCode();
    this.fetchConnectionStatus();
    setInterval(this.fetchConnectionStatus, 35000); // Actualiza el estado cada 35 segundos
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
        <span>{{ $t('INBOX_MGMT.ADD.WHATSAPP.INBOX_NAME.LABEL') }}:</span>
        <input
          type="text"
          class="border p-2 rounded-md"
          :placeholder="$t('INBOX_MGMT.ADD.WHATSAPP.INBOX_NAME.PLACEHOLDER')"
          v-model="inboxName"
          required
        />

        <span>Estado de conexión:</span>
        <p :class="{'text-green-500': connectionState === 'Conectado', 'text-red-500': connectionState !== 'Conectado'}">
          {{ connectionState }}
        </p>

        <span v-if="connectionState !== 'Conectado'">Escanee el código QR:</span>
        <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
        <img v-else-if="qrCodeUrl && connectionState !== 'Conectado'" :src="qrCodeUrl" alt="Código QR" class="border p-2 rounded-md w-40 h-40"/>

        <span>{{ $t('INBOX_MGMT.ADD.WHATSAPP.PHONE_NUMBER.LABEL') }}:</span>
        <input type="text" class="border p-2 rounded-md" v-model="phoneNumber" disabled/>
      </label>

      <div class="w-full">
        <!-- Botón para mostrar información de la conexión -->
        <button @click="showConnectionStatus">Crear canal</button>
      </div>
    </div>
  </div>
</template>
