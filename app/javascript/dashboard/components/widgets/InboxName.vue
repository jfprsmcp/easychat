<script>
import { getInboxClassByType } from 'dashboard/helper/inbox';

export default {
  props: {
    show_state:{
      type: Boolean,
      default:false
    },
    conversation_state: {
      type: Object,
      default: null 
    },
    inbox: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    computedInboxClass() {
      const { phone_number: phoneNumber, channel_type: type } = this.inbox;
      const classByType = getInboxClassByType(type, phoneNumber);
      return classByType;
    },
  },
};
</script>

<template>
  <div
    class="inbox--name gap-1 inline-flex items-center py-0.5 px-0 leading-3 whitespace-nowrap font-medium bg-none text-slate-600 dark:text-slate-500 text-xs my-0 mx-2.5"
  >
    <fluent-icon
      class="mr-0.5 rtl:ml-0.5 rtl:mr-0"
      :icon="computedInboxClass"
      size="12"
    />
    {{ inbox.name }}
    <template v-if="conversation_state && conversation_state.name && show_state">
      <span :style="{ backgroundColor: conversation_state.color }" class="text-xs inline-flex items-center rounded-md px-2 py-1 text-slate-900 dark:text-slate-100 font-medium">
        {{ conversation_state.name }}
      </span>
    </template>
    <template v-else-if="show_state">
      <span class="text-xs inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-slate-900 dark:text-slate-100 font-medium ring-1 ring-gray-500/10 ring-inset">
          no categorizada
      </span>
    </template>
  </div>
</template>
