<script>
import ChatListHeader from './ChatListHeader.vue';
import { mapGetters } from 'vuex';
import BoardColumn from './BoardColumn.vue';
export default {
    props: {
        conversationType: {
            type: String,
            default: '',
        },
    },
    components: {
        ChatListHeader,
        BoardColumn
    },
    computed: {
        ...mapGetters({
            kanbanStateList: 'kanbanState/getKanbanState',
            uiFlags: 'kanbanState/getUIFlags',
        }),
        pageTitle() {
            return this.$t('BOARD.HEADER')
        },
        activeStatus() {
            return "open"
        }
    },
    methods: {
        selectConversation(conversationId, inboxId) {
            this.$store.dispatch(
                'bulkActions/setSelectedConversationIds',
                conversationId
            );
            this.selectedInboxes.push(inboxId);
        },
        deSelectConversation(conversationId, inboxId) {
            this.$store.dispatch(
                'bulkActions/removeSelectedConversationIds',
                conversationId
            );
            this.selectedInboxes = this.selectedInboxes.filter(
                item => item !== inboxId
            );
        },
        async onAssignAgent(agent, conversationId = null) {
            try {
                await this.$store.dispatch('bulkActions/process', {
                    type: 'Conversation',
                    ids: conversationId || this.selectedConversations,
                    fields: {
                        assignee_id: agent.id,
                    },
                });
                this.$store.dispatch('bulkActions/clearSelectedConversationIds');
                if (conversationId) {
                    useAlert(
                        this.$t(
                            'CONVERSATION.CARD_CONTEXT_MENU.API.AGENT_ASSIGNMENT.SUCCESFUL',
                            {
                                agentName: agent.name,
                                conversationId,
                            }
                        )
                    );
                } else {
                    useAlert(this.$t('BULK_ACTION.ASSIGN_SUCCESFUL'));
                }
            } catch (err) {
                useAlert(this.$t('BULK_ACTION.ASSIGN_FAILED'));
            }
        },
        async onAssignTeam(team, conversationId = null) {
            try {
                await this.$store.dispatch('assignTeam', {
                    conversationId,
                    teamId: team.id,
                });
                useAlert(
                    this.$t(
                        'CONVERSATION.CARD_CONTEXT_MENU.API.TEAM_ASSIGNMENT.SUCCESFUL',
                        {
                            team: team.name,
                            conversationId,
                        }
                    )
                );
            } catch (error) {
                useAlert(
                    this.$t('CONVERSATION.CARD_CONTEXT_MENU.API.TEAM_ASSIGNMENT.FAILED')
                );
            }
        },
        async onAssignLabels(labels, conversationId = null) {
            try {
                await this.$store.dispatch('bulkActions/process', {
                    type: 'Conversation',
                    ids: conversationId || this.selectedConversations,
                    labels: {
                        add: labels,
                    },
                });
                this.$store.dispatch('bulkActions/clearSelectedConversationIds');
                if (conversationId) {
                    useAlert(
                        this.$t(
                            'CONVERSATION.CARD_CONTEXT_MENU.API.LABEL_ASSIGNMENT.SUCCESFUL',
                            {
                                labelName: labels[0],
                                conversationId,
                            }
                        )
                    );
                } else {
                    useAlert(this.$t('BULK_ACTION.LABELS.ASSIGN_SUCCESFUL'));
                }
            } catch (err) {
                useAlert(this.$t('BULK_ACTION.LABELS.ASSIGN_FAILED'));
            }
        },
        toggleConversationStatus(conversationId, status, snoozedUntil) {
            this.$store
                .dispatch('toggleStatus', {
                    conversationId,
                    status,
                    snoozedUntil,
                })
                .then(() => {
                    useAlert(this.$t('CONVERSATION.CHANGE_STATUS'));
                    this.isLoading = false;
                });
        },
        onContextMenuToggle(state) {
            this.isContextMenuOpen = state;
        },
        async markAsUnread(conversationId) {
            try {
                await this.$store.dispatch('markMessagesUnread', {
                    id: conversationId,
                });
                const {
                    params: { accountId, inbox_id: inboxId, label, teamId },
                    name,
                } = this.$route;
                let conversationType = '';
                if (isOnMentionsView({ route: { name } })) {
                    conversationType = 'mention';
                } else if (isOnUnattendedView({ route: { name } })) {
                    conversationType = 'unattended';
                }
                this.$router.push(
                    conversationListPageURL({
                        accountId,
                        conversationType: conversationType,
                        customViewId: this.foldersId,
                        inboxId,
                        label,
                        teamId,
                    })
                );
            } catch (error) {
                // Ignore error
            }
        },
        async assignPriority(priority, conversationId = null) {
            this.$store.dispatch('setCurrentChatPriority', {
                priority,
                conversationId,
            });
            this.$store
                .dispatch('assignPriority', { conversationId, priority })
                .then(() => {
                    this.$track(CONVERSATION_EVENTS.CHANGE_PRIORITY, {
                        newValue: priority,
                        from: 'Context menu',
                    });
                    useAlert(
                        this.$t('CONVERSATION.PRIORITY.CHANGE_PRIORITY.SUCCESSFUL', {
                            priority,
                            conversationId,
                        })
                    );
                });
        },
    },
    provide() {
        return {
            selectConversation: this.selectConversation,
            deSelectConversation: this.deSelectConversation,
            assignAgent: this.onAssignAgent,
            assignTeam: this.onAssignTeam,
            assignLabels: this.onAssignLabels,
            updateConversationStatus: this.toggleConversationStatus,
            toggleContextMenu: this.onContextMenuToggle,
            markAsUnread: this.markAsUnread,
            assignPriority: this.assignPriority,
        };
    },
    mounted() {
        this.$store.dispatch('conversationPage/clearCurrentPageBoard')
        this.$store.dispatch('conversationPage/clearEndReachedBoard')
        this.$store.dispatch('clearConversationBoard')
        this.$store.dispatch('kanbanState/get')
    }
}
</script>
<template>
    <div
        class="flex flex-col flex-shrink-0 border-r w-full conversations-list-wrap rtl:border-r-0 rtl:border-l border-slate-50 dark:border-slate-800/50">
        <slot />
        <ChatListHeader :page-title="pageTitle" :has-applied-filters="false" :has-active-folders="false"
            :active-status="activeStatus" />
        <div class="flex gap-5 p-5 content-card">
            <div v-for="(card) in kanbanStateList" :key="card.id" class="card">
                <h3 class="card-title">{{ card.name }}</h3>
                <BoardColumn group="kanban" :group-id="card.id" :order="card.order" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.content-card {
    overflow-x: auto;
    display: flex;
    max-width: 100%;
    flex: 1;
}

.card {
    min-width: 380px;
    box-shadow: 0px 0px 4px -1px darkgray;
    padding: 10px;
    border-radius: 8px;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

.card-title {
    box-shadow: 0px 1px 2px -1px darkgray;
    padding: 2px 10px 10px 10px;
}
</style>