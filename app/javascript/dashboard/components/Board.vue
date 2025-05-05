<script>
import BoardHeader from './BoardHeader.vue';
import { mapGetters } from 'vuex';
import BoardColumn from './BoardColumn.vue';
export default {
    props: {
        minWidth: {
            type: Number,
            default: 300
        },
        expandedFull: {
            type: Boolean,
            default: true
        },
    },
    components: {
        BoardHeader,
        BoardColumn
    },
    methods: {
        borderStyle(color) {
            return {
                border: "none",
                height: "4px",
                backgroundColor: color,
                borderRadius: "20px",
                margin: "12px 0px 0px 0px"
            }
        },
        counterStyle(color) {
            return {
                backgroundColor: color,
                color: "whitesmoke"
            }
        }
    },
    computed: {
        ...mapGetters({
            columnList: 'getBoardConversations',
            kanbanStateList: 'kanbanState/getKanbanState',
            uiFlags: 'kanbanState/getUIFlags',
        }),
        pageTitle() {
            return this.$t('BOARD.HEADER')
        },
        activeStatus() {
            return "open"
        },
        contentStyles(){
            return {
                width: this.expandedFull  ? "100%" : `${this.minWidth}px`
            }
        },
        loadConversationAllColumn() {
            if (this.kanbanStateList.length == 0)
                return false
            return this.kanbanStateList.length == this.columnList.length;
        }
    },
    watch: {
        loadConversationAllColumn(value){
            if(value){
                this.$emit('conversationLoad');
            }
        }
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
        class="flex flex-col flex-shrink-0 border-r conversations-list-wrap rtl:border-r-0 rtl:border-l border-slate-50 dark:border-slate-800/50"
        :style="contentStyles"
    >
        <slot />
        <BoardHeader 
            :page-title="pageTitle" 
        />
        <div class="flex gap-5 p-5 content-card">
            <div v-for="(card) in kanbanStateList" :key="card.id" class="card">
                <div 
                    class="card-title tabs-title"
                >
                    <span class="font-medium">{{ card.name }}</span>
                    <div class="badge min-w-[20px]" :style="counterStyle(card.color)">
                        <span>{{ card.count }}</span>
                    </div>
                </div>
                <hr :style="borderStyle(card.color)"/>
                <BoardColumn :column="card"  group="kanban" />
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
    padding: 2px 5px 0px 5px;
    display: flex;
    justify-content: space-between;
    margin: 0;
}
</style>