<script>
import wootConstants from 'dashboard/constants/globals';
import Draggable from 'vuedraggable';
import { mapGetters } from 'vuex';
import ColumnItem from './ColumnItem.vue';
import IntersectionObserver from './IntersectionObserver.vue';
export default {
  props: {
    group: {
      type: String,
      required: true
    },
    groupId: {
      type: Number,
      required: true
    },
    order: {
      type: Number,
      required: true
    },
  },
  components: {
    ColumnItem,
    Draggable,
    IntersectionObserver
  },
  data() {
    return {
      activeAssigneeTab: wootConstants.ASSIGNEE_TYPE.ALL,
      infiniteLoaderOptions: null,
      infiniteLoaderOptions: {
        root: this.$refs.conversationListRef,
        rootMargin: '100px 0px 100px 0px',
      },
    }
  },
  computed: {
    ...mapGetters({
      listBoard: 'getBoardConversations',
      boardListLoading: 'getBoardListLoadingStatus',
    }),
    currentFiltersPage() {
      return this.$store.getters['conversationPage/getCurrentPageBoardFilter'](this.groupId);
    },
    hasCurrentPageEndReachedColumn() {
      return this.$store.getters['conversationPage/getHasEndReachedBoard'](this.groupId);
    },
    loading() {
      let test = this.boardListLoading[`${this.groupId}`] ?? true
      return test
    },
    columnDefault() {
      return this.order == 0;
    },
    conversationLists() {
      let itemsColumn = this.listBoard.find((column) => column.id == this.groupId)
      return (itemsColumn == undefined ? { id: this.groupId, data: [] } : itemsColumn)
    },
    conversationFilters() {
      let filters = { group: this.group, column_id: this.groupId, page: (this.currentFiltersPage + 1) }
      if (!this.columnDefault) {
        filters["group_id"] = this.groupId
      }
      return filters;
    },
    showEndOfListMessage() {
      return (
        this.conversationLists.data.length &&
        this.hasCurrentPageEndReachedColumn &&
        !this.loading
      );
    }
  },
  methods: {
    add(e) {
      let fromList = e.from.__vue__.list
      let toList = e.to.__vue__.list
      let item = e.item._underlying_vm_
      try {
        let params = {
          conversationId: item.id,
          kanban_states_id: (this.columnDefault) ? 'null' : this.groupId
        }
        this.$store.dispatch('fetchUpdateKanbanStateConversation', params)
      } catch (error) {
        fromList.splice(e.oldIndex, 0, item)
        toList.splice(e.newIndex, 1)
      }
    },
    loadMoreConversation() {
      if (this.hasCurrentPageEndReachedColumn || this.loading) {
        return;
      }
      this.$store.dispatch('fetchConversationBoard', this.conversationFilters)
    },
  },
  mounted() {
    this.$store.dispatch('fetchConversationBoard', this.conversationFilters)
  }
}
</script>
<template>
  <Draggable ref="conversationListRef" class="flex flex-col gap-5 flex-1 overflow-auto pr-2 pb-2"
    :list="conversationLists.data" group="column" @add="add">
    <ColumnItem v-for="(element) in conversationLists.data" :key="element.id" :source="element" />
    <template>
      <div v-if="loading" class="text-center">
        <span class="mt-4 mb-4 spinner" />
      </div>
      <p v-if="showEndOfListMessage" class="p-4 text-center text-slate-400 dark:text-slate-300">
        {{ $t('CHAT_LIST.EOF') }}
      </p>
      <IntersectionObserver 
        v-if="!showEndOfListMessage" 
        :options="infiniteLoaderOptions"
        @observed="loadMoreConversation" 
      />
    </template>
  </Draggable>
</template>