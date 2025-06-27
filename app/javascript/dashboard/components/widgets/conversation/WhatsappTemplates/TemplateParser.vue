<script>
/**
 * This component handles parsing and sending WhatsApp message templates.
 * It works as follows:
 * 1. Displays the template text with variable placeholders.
 * 2. Generates input fields for each variable in the template.
 * 3. Validates that all variables are filled before sending.
 * 4. Replaces placeholders with user-provided values.
 * 5. Emits events to send the processed message or reset the template.
 */
import { ref, computed, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { requiredIf } from '@vuelidate/validators';

export default {
  props: {
    template: {
      type: Object,
      default: () => ({}),
    },
    showButtonAction: {
      type: Boolean,
      default: true,
    }
  },
  setup(props, { emit }) {
    const processVariable = str => {
      return str.replace(/{{|}}/g, '');
    };

    const allKeysRequired = value => {
      const keys = Object.keys(value);
      return keys.every(key => value[key]);
    };

    const processedParams = ref({});
    const file = ref("");
    
    const includeHeader = computed(() => {
      return props.template.components.find(
        component => component.type === 'HEADER'
      )
    })

    const templateString = computed(() => {
      return props.template.components.find(
        component => component.type === 'BODY'
      ).text;
    });

    const variables = computed(() => {
      return templateString.value.match(/{{([^}]+)}}/g);
    });

    const processedString = computed(() => {
      return templateString.value.replace(/{{([^}]+)}}/g, (match, variable) => {
        const variableKey = processVariable(variable);
        return processedParams.value[variableKey] || `{{${variable}}}`;
      });
    });

    const v$ = useVuelidate(
      {
        file: {
          required: requiredIf(includeHeader)
        },
        processedParams: {
          requiredIfKeysPresent: requiredIf(variables),
          allKeysRequired,
        },
      },
      { processedParams, file }
    );

    const generateVariables = () => {
      const matchedVariables = templateString.value.match(/{{([^}]+)}}/g);
      if (!matchedVariables) return;

      const finalVars = matchedVariables.map(i => processVariable(i));
      processedParams.value = finalVars.reduce((acc, variable) => {
        acc[variable] = '';
        return acc;
      }, {});
    };

    const resetTemplate = () => {
      emit('resetTemplate');
    };

    const validateParams = () => {
      v$.value.$touch();
      return !v$.value.$invalid
    }

    const getTemplateMessage = () => {
      let template = {
        message: processedString.value,
        templateParams: {
          name: props.template.name,
          category: props.template.category,
          language: props.template.language,
          namespace: props.template.namespace,
          processed_params: processedParams.value
        },
      };
      if (includeHeader.value) {
        template.templateParams.header = {
          url: file.value,
          format: includeHeader.value.format
        }
      }
      return template
    }

    const sendMessage = () => {
      if (!validateParams) return
      emit('sendMessage', getTemplateMessage());
    };

    onMounted(generateVariables);

    return {
      processedParams,
      variables,
      templateString,
      processedString,
      v$,
      resetTemplate,
      sendMessage,
      getTemplateMessage,
      validateParams,
      includeHeader,
      file
    };
  },
};
</script>

<template>
  <div class="w-full relative">
    <span
      v-if="!showButtonAction"
      class="absolute z-10 cursor-pointer"
      style="top: -30px; right: 0px;"
      @click="resetTemplate"
    >✖</span>
    <textarea
      v-model="processedString"
      rows="4"
      readonly
      class="template-input mt-2"
    />
    <div v-if="includeHeader" class="template__variables-container">
      <p class="variables-label">
        {{ $t('WHATSAPP_TEMPLATES.PARSER.HEADER_FILE') }}
      </p>
      <div
        class="template__variable-item"
      >
        <span class="variable-label">
          {{includeHeader.format.toLowerCase()}}
        </span>
        <woot-input
          v-model="file"
          type="text"
          class="variable-input"
          :styles="{ marginBottom: 0 }"
        />
      </div>
    </div>
    <div v-if="variables" class="template__variables-container">
      <p class="variables-label">
        {{ $t('WHATSAPP_TEMPLATES.PARSER.VARIABLES_LABEL') }}
      </p>
      <div
        v-for="(variable, key) in processedParams"
        :key="key"
        class="template__variable-item"
      >
        <span class="variable-label">
          {{ key }}
        </span>
        <woot-input
          v-model="processedParams[key]"
          type="text"
          class="variable-input"
          :styles="{ marginBottom: 0 }"
        />
      </div>
      <p v-if="v$.$dirty && v$.$invalid" class="error">
        {{ $t('WHATSAPP_TEMPLATES.PARSER.FORM_ERROR_MESSAGE') }}
      </p>
    </div>
    <footer v-if="showButtonAction">
      <woot-button variant="smooth" @click="resetTemplate">
        {{ $t('WHATSAPP_TEMPLATES.PARSER.GO_BACK_LABEL') }}
      </woot-button>
      <woot-button type="button" @click="sendMessage">
        {{ $t('WHATSAPP_TEMPLATES.PARSER.SEND_MESSAGE_LABEL') }}
      </woot-button>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.template__variables-container {
  @apply p-2.5;
}

.variables-label {
  @apply text-sm font-semibold mb-2.5;
}

.template__variable-item {
  @apply items-center flex mb-2.5;

  .label {
    @apply text-xs;
  }

  .variable-input {
    @apply flex-1 text-sm ml-2.5;
  }

  .variable-label {
    @apply bg-slate-75 dark:bg-slate-700 text-slate-700 dark:text-slate-100 inline-block rounded-md text-xs py-2.5 px-6;
  }
}

footer {
  @apply flex justify-end;

  button {
    @apply ml-2.5;
  }
}
.error {
  @apply bg-red-100 dark:bg-red-100 rounded-md text-red-800 dark:text-red-800 p-2.5 text-center;
}
.template-input {
  @apply bg-slate-25 dark:bg-slate-900 text-slate-700 dark:text-slate-100;
}
</style>
