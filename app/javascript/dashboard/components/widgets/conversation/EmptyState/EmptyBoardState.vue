<script>
import { mapGetters } from 'vuex';
import { useAdmin } from 'dashboard/composables/useAdmin';
import { useAccount } from 'dashboard/composables/useAccount';
import OnboardingView from '../OnboardingView.vue';
import EmptyStateMessage from './EmptyStateMessage.vue';

export default {
  components: {
    OnboardingView,
    EmptyStateMessage,
  },
  props: {
    isOnExpandedLayout: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { isAdmin } = useAdmin();

    const { accountScopedUrl } = useAccount();

    return {
      isAdmin,
      accountScopedUrl,
    };
  },
  computed: {
    ...mapGetters({
      currentChatId: 'getSelectChatId',
      columnList: 'getBoardConversations',
      inboxesList: 'inboxes/getInboxes',
      uiFlags: 'inboxes/getUIFlags',
      loadingBoardList: 'getBoardListLoadingStatus',
    }),
    emptyListConversation(){
      return this.columnList.some(column => column.data > 0);
    },
    loadingConversationColumn(){
      return Object.values(this.loadingBoardList).some(value => value);
    },
    loadingIndicatorMessage() {
      if (this.uiFlags.isFetching) {
        return this.$t('CONVERSATION.LOADING_INBOXES');
      }
      return this.$t('CONVERSATION.LOADING_CONVERSATIONS');
    },
    conversationMissingMessage() {
      if (!this.isOnExpandedLayout) {
        return this.$t('CONVERSATION.SELECT_A_CONVERSATION');
      }
      return this.$t('CONVERSATION.404');
    },
    newInboxURL() {
      return this.accountScopedUrl('settings/inboxes/new');
    },
    emptyClassName() {
      if (
        !this.inboxesList.length &&
        !this.uiFlags.isFetching &&
        !this.loadingConversationColumn &&
        this.isAdmin
      ) {
        return 'h-full overflow-auto';
      }
      return 'flex-1 min-w-0 px-0 flex flex-col items-center justify-center h-full';
    },
  },
};
</script>

<template>
  <div :class="emptyClassName">
    <woot-loading-state
      v-if="uiFlags.isFetching || loadingConversationColumn"
      :message="loadingIndicatorMessage"
    />
    <!-- No inboxes attached -->
    <div
      v-if="!inboxesList.length && !uiFlags.isFetching && !loadingConversationColumn"
      class="clearfix"
    >
      <OnboardingView v-if="isAdmin" />
      <EmptyStateMessage v-else :message="$t('CONVERSATION.NO_INBOX_AGENT')" />
    </div>
    <!-- Show empty state images if not loading -->

    <div
      v-else-if="!uiFlags.isFetching && !loadingConversationColumn"
      class="flex flex-col items-center justify-center h-full"
    >
      <!-- No conversations available -->
      <EmptyStateMessage
        v-if="emptyListConversation"
        :message="$t('CONVERSATION.NO_MESSAGE_1')"
      />
      <EmptyStateMessage
        v-else-if="!emptyListConversation && !currentChatId"
        :message="conversationMissingMessage"
      />
    </div>
  </div>
</template>
