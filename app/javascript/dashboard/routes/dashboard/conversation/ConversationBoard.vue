<script>
import Board from '../../../components/Board.vue';
import ConversationBox from '../../../components/widgets/conversation/ConversationBox.vue';
import PopOverSearch from './search/PopOverSearch.vue';

export default {
  components: {
    Board,
    PopOverSearch,
    ConversationBox
  },
  props: {
    inboxId: {
      type: [String, Number],
      default: 0,
    },
    label: {
      type: String,
      default: '',
    },
    teamId: {
      type: String,
      default: '',
    },
    conversationType: {
      type: String,
      default: '',
    },
    foldersId: {
      type: [String, Number],
      default: 0,
    },
    showMessageView: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isOnExpandedLayout() {
      return false
    },
    showConversationList() {
      return false
    },
  },
  methods: {
    toogleBarMessage() {
      this.showMessageView = !this.showMessageView;
    }
  }
}
</script>
<template>
  <section class="bg-white conversation-page dark:bg-slate-900">
    <slot />
    <Board
      :show-conversation-list="showConversationList"
      :conversation-inbox="inboxId"
      :label="label"
      :team-id="teamId"
      :conversation-type="conversationType"
      :folders-id="foldersId"
    >
      <PopOverSearch :is-on-expanded-layout="isOnExpandedLayout" />
    </Board>
  </section>
</template>

<style lang="scss" scoped>
.conversation-page {
  display: flex;
  width: 100%;
  height: 100%;
}

.bar-message-space {
  width: 40px;
  writing-mode: vertical-lr;
  transform: rotate(180deg);
}
</style>