<script>
import { mapGetters } from 'vuex';
import Board from '../../../components/Board.vue';
import ConversationBoardBox from '../../../components/widgets/conversation/ConversationBoardBox.vue';
import PopOverSearch from './search/PopOverSearch.vue';
import wootConstants from 'dashboard/constants/globals';
import { useUISettings } from 'dashboard/composables/useUISettings';
import { BUS_EVENTS } from 'shared/constants/busEvents';

export default {
  components: {
    Board,
    PopOverSearch,
    ConversationBoardBox
  },
  props: {
    inboxId: {
      type: [String, Number],
      default: 0,
    },
    conversationId: {
      type: [String, Number],
      default: 0,
    },
    columnId: {
      type: [String, Number],
      default: 0,
    },
  },
  data() {
    return {
      expandedLayout: true
    }
  },
  setup() {
    const { uiSettings, updateUISettings } = useUISettings();
    return {
      uiSettings,
      updateUISettings,
    };
  },
  computed: {
    ...mapGetters({
      columnList: 'getBoardConversations',
      currentChatId: 'getSelectChatId',
      accountId: 'getCurrentAccountId',
    }),
    pathBoard(){
      return `/app/accounts/${this.accountId}/board`
    },
    showMessageView() {
      return this.conversationId ? true : !this.expandedLayout;
    },
    isContactPanelOpen() {
      if (this.currentChatId) {
        const { is_contact_sidebar_open: isContactSidebarOpen } = this.uiSettings;
        return isContactSidebarOpen;
      }
      return false;
    },
    lengthConversationBoard() {
      return this.columnList.reduce((sum, column) => sum + (column.data.length), 0);
    }
  },
  watch: {
    lengthConversationBoard() {
      this.setActiveChat();
    },
    conversationId() {
      this.fetchConversationIfUnavailable();
    },
  },
  methods: {
    onConversationLoad() {
      this.fetchConversationIfUnavailable();
    },
    initialize() {
      this.$store.dispatch('setActiveInbox', this.inboxId);
      this.setActiveChat();
    },
    setActiveChat() {
      if (this.conversationId) {
        const selectedConversation = this.findConversation();
        // If conversation doesn't exist or selected conversation is same as the active
        // conversation, don't set active conversation.
        if (!selectedConversation || selectedConversation.id === this.currentChatId) {
          return;
        }
        // set currrentChat con selectedConversation
        const { messageId } = this.$route.query;
        this.$store.dispatch('setActiveChat', {
          data: selectedConversation,
          after: messageId
        }).then(() => {
          this.$emitter.emit(BUS_EVENTS.SCROLL_TO_MESSAGE, { messageId });
        });
      } else {
        this.$store.dispatch('clearSelectedState');
      }
    },
    fetchConversationIfUnavailable() {
      if (!this.conversationId) {
        return;
      }
      const chat = this.findConversation();
      if (!chat) {
        this.$store.dispatch('getConversation', this.conversationId);
      }
    },
    findConversation() {
      const conversationId = parseInt(this.conversationId, 10);
      const columnId = parseInt(this.columnId, 10);
      if (columnId == 0) {
        return this.findConversationColumnOrder(conversationId, 0)
      }
      return this.findConversationColumnId(conversationId, columnId)
    },
    findConversationColumnId(conversationId, columnId) {
      for (const column of this.columnList) {
        if (column.id == columnId) {
          return column.data.find((conversation) => conversation.id == conversationId)
        }
      }
      return undefined
    },
    findConversationColumnOrder(conversationId, order) {
      for (const column of this.columnList) {
        if (column.order == order) {
          return column.data.find((conversation) => conversation.id == conversationId)
        }
      }
      return undefined
    },
    onToggleContactPanel() {
      this.updateUISettings({
        is_contact_sidebar_open: !this.isContactPanelOpen,
      });
    },
    toggleConversationLayout() {
      this.expandedLayout = !this.expandedLayout
      if (this.expandedLayout) {
        this.$router.push({ path: this.pathBoard })
      }
    },
  },
  mounted() {
    this.$store.dispatch('agents/get');
    this.initialize();
    this.$watch('$store.state.route', () => this.initialize());
  }
}
</script>
<template>
  <section class="bg-white conversation-page dark:bg-slate-900">
    <Board 
      :min-width="420" 
      :expandedFull="!showMessageView" 
      @conversationLoad="onConversationLoad"
    >
      <PopOverSearch 
        @toggleConversationLayout="toggleConversationLayout" 
        :is-on-expanded-layout="expandedLayout" 
      />
    </Board>
    <ConversationBoardBox 
      v-if="showMessageView" 
      :inbox-id="inboxId" 
      :is-contact-panel-open="isContactPanelOpen"
      :is-on-expanded-layout="expandedLayout" 
      @contactPanelToggle="onToggleContactPanel" 
    />
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