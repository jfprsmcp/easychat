<script>
import { mapGetters } from 'vuex';
export default {
    props: {
        open: {
            type: Boolean,
            default: false
        },
        conversationId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            loading: false,
            indexMessageSelected: undefined,
            firstOpenConversatioSuggestion: true,
            _fetchBlock: false
        }
    },
    computed: {
        ...mapGetters({
            messages: 'getSuggestionMessages',
        }),
        failLoadSuggestionMessage(){
            return (
                this.messages.length == 0 &&
                !this.loading
            )
        }
    },
    watch: {
        conversationId() {
            this.firstOpenConversatioSuggestion = true
        },
        open(value) {
            if (!value) return
            this.indexMessageSelected = undefined
            if (this.firstOpenConversatioSuggestion) {
                this.firstOpenConversatioSuggestion = false
                this.fetchSuggestionMessage()
            }
        }
    },
    methods: {
        async syncronized(callback){
            if(this._fetchBlock) return
            this._fetchBlock = true
            await callback()
            this._fetchBlock = false
        },
        clearSuggestionMessage() {
            this.$store.dispatch('clearSuggestionMessage')
        },
        fetchSuggestionMessage() {
            if (!this.open)
                return
            this.syncronized(async () => {
                try {
                    this.loading = true
                    this.clearSuggestionMessage()
                    await this.$store.dispatch('getSuggestionMessage', {
                        conversationId: this.conversationId,
                        count_responses: 3
                    })
                } catch (error) {
                    console.warn({ error })
                } finally {
                    this.loading = false
                }
            })
        },
        clickSelectedMessageSuggestion(message, indexSelected) {
            this.indexMessageSelected = indexSelected;
            this.$store.dispatch("setSelectedMessageSuggestion", '')
            this.$nextTick(() => {
                this.$store.dispatch("setSelectedMessageSuggestion", message)
            })
        },
        classActiveSuggestionMessage(indexSelected) {
            if (this.indexMessageSelected == undefined || this.indexMessageSelected != indexSelected) {
                return {}
            }
            return {
                'selected-message': true,
            }
        }
    }
}
</script>
<template>
    <div v-if="open" class="conversation-message-suggestion">
        <div class="flex items-center justify-between">
            <h3>{{ $t('CONVERSATION.REPLYBOX.SUGGESTION.TITLE') }}</h3>
            <woot-button 
                variant="clear" 
                color-scheme="secondary"
                icon="loading" 
                :disabled="loading"
                @click="fetchSuggestionMessage" 
            />
        </div>
        <hr class="separator"/>
        <div class="flex flex-col gap-2">
            <div v-if="loading" class="text-center">
                <span class="mt-4 mb-4 spinner" />
            </div>
            <div v-for="(message, index) in messages" :key="index"
                class="bg-primary py-1 px-2 rounded-md cursor-pointer" 
                @click="clickSelectedMessageSuggestion(message, index)"
                :class="classActiveSuggestionMessage(index)"
                >
                <small>{{ message }}</small>
            </div>
            <div v-if="failLoadSuggestionMessage" class="text-center mt-2">
                <small>No se pudo cargar mensajes</small>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.conversation-message-suggestion {
    width: 350px;
    padding: 8px 20px 8px 8px;
    box-shadow: -1px 0px 3px -2px gray;
    overflow-y: auto;
}
.separator {
    margin: 5px 0;
}
.bg-primary {
    background-color: var(--green-suggetion);
    color: white;
    padding: 5px 8px;
}
.bg-primary:hover {
    transition: 500ms background-color;
    background-color: var(--green-suggetion-hover);
}
    
.selected-message {
    background-color: var(--green-suggetion-hover);
}
</style>