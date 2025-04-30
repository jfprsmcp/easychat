<script>
import ConversationCardBasic from './widgets/conversation/ConversationCardBasic.vue';
export default {
  components: {
    ConversationCardBasic,
  },
  props: {
    source: {
      type: Object,
      required: true,
    },
    isConversationSelected: {
      type: Function,
      default: () => {},
    },
    showAssignee: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<template>
  <ConversationCardBasic
    :key="source.id"
    :chat="source"
    :selected="isConversationSelected(source.id)"
    :show-assignee="showAssignee"
  />
</template>
