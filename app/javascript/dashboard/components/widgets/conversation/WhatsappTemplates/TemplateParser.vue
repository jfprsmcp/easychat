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
import { watch } from 'vue';
import FileUpload from 'vue-upload-component';
import MultiselectDropdown from 'shared/components/ui/MultiselectDropdown.vue';
import { uploadFile } from '../../../../helper/uploadHelper';
import { useAccount } from 'dashboard/composables/useAccount';

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
  components: {
    FileUpload,
    MultiselectDropdown
  },
  setup(props, { emit }) {
    const processVariable = str => {
      return str.replace(/{{|}}/g, '');
    };
    const { accountId } = useAccount();

    const allKeysRequired = value => {
      const keys = Object.keys(value);
      return keys.every(key => value[key]);
    };

    const processedParams = ref({});
    const file = ref();
    const previeImage = ref("/assets/images/default/image-preview.png");
    const typeParameter = ref([
      { id: 1, type: "static" },
      { id: 2, type: "dinamic" }
    ])
    const attributesContact = ref(["name","email","phone_number"])

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
        return processedParams.value[variableKey]?.content || `{{${variable}}}`;
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
        acc[variable] = {
          content: "",
          type: "static"
        }
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

    const getTemplateMessage = async () => {
      let template = {}
      try {
        template.message = processedString.value
        template.templateParams = {
          name: props.template.name,
          category: props.template.category,
          language: props.template.language,
          namespace: props.template.namespace,
          processed_params: processedParams
        }
        if (includeHeader.value) {
          const response = await uploadFile(file.value, accountId.value)
          template.templateParams.header = {
            url: response.blobKey,
            format: includeHeader.value.format
          }
        }
        return template
      } catch (error) {
        console.warn({ error: `template invalid ${error}`, template })
        return undefined
      }
    }

    const sendMessage = async () => {
      if (!validateParams) return
      let template = await getTemplateMessage()
      if (!template) {
        console.warn({ error: "template invalid", template })
        return
      }
      emit('sendMessage', template);
    };

    const onFileChange = (event) => {
      if (!event) return
      file.value = event.file
    }

    const onSelectTypeParam = (paramName, value) => {
      processedParams.value[paramName].type = value
      if (value == 'static') {
        processedParams.value[paramName].content = ""
        return
      }
      processedParams.value[paramName].content = attributesContact.value[0];
    }

    const onSelectAttributeContact = (paramName, attributeName) => {
      processedParams.value[paramName].content = attributeName
    }

    watch(file, (newFile) => {
      const reader = new FileReader();
      reader.onload = () => {
        previeImage.value = reader.result
      };
      reader.readAsDataURL(newFile);
    });

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
      file,
      onFileChange,
      previeImage,
      typeParameter,
      onSelectTypeParam,
      attributesContact,
      onSelectAttributeContact
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
        class="template__variable flex flex-col justify-center items-center"
        >
        <FileUpload 
          :multiple="false" 
          :maximum="1" 
          :extensions="['jpg', 'png', 'jpeg']" 
          :accept="'image/*'"
          @input-file="onFileChange" 
          class="cursor-pointer">
          <img :src="previeImage" alt="image preview header" class="image-preview" />
          <button>Seleccionar imagen</button>
        </FileUpload>
      </div>
    </div>
    <div v-if="variables" class="template__variables-container">
      <p class="variables-label">
        {{ $t('WHATSAPP_TEMPLATES.PARSER.VARIABLES_LABEL') }}
      </p>
      <div 
        v-for="(value, key) in processedParams" 
        :key="key" 
        class="template__variable-item gap-2"
        >
        <span class="variable-label">
          {{ key }}
        </span>
        <template v-if="value.type == 'dinamic'">
          <select 
            class="variable-input my-1"
            :styles="{ marginBottom: 0 }"
            @change="(e) => onSelectAttributeContact(key, e.target.value)"
            >
            <option v-for="keyword in attributesContact" :key="keyword" :value="keyword">
              {{ keyword }}
            </option>
          </select>
        </template>
        <template v-else>
          <woot-input
            v-model="value.content"
            type="text"
            class="variable-input my-1"
            :styles="{ marginBottom: 0 }"
          />
        </template>
        <select 
          class="w-24 m-0"
          :value="value.type" 
          @change="(e) => onSelectTypeParam(key, e.target.value)">
          <option v-for="option in typeParameter" :key="option.id" :value="option.type">
            {{ option.type }}
          </option>
        </select>
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
.image-preview{
  object-fit: cover;
  width: 30%;
  margin: 0 auto;
}

</style>
