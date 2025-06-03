<script>
import { mapGetters } from 'vuex';
import agentCloud from '../../../api/agentCloud';
import conversationSentimentsApi from '../../../api/conversationSentimentsApi';
import { MESSAGE_TYPE } from '../../../../shared/constants/messages';
import { BUS_EVENTS } from '../../../../shared/constants/busEvents';

const MAX_MESSAGE_EVALUATE = 100
const OVERRIDE_LIMIT_MESSAGE_INCOMMING = 3

export default {
    props: {
        open: {
            type: Boolean,
            default: false
        },
        conversationId: {
            type: Number,
            required: true
        },
        chat: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            sentiments: undefined,
            satisfaction: {
                score: 0,
                category: "",
                justification: "",
                icon:""
            },
            loading: {
                fetchSuggestion: false,
                fetchSentiment: false
            },
            indexMessageSelected: undefined,
            firstOpenConversatioSuggestion: true,
            _lockSuggestion:false,
            _lockSentiment:false
        }
    },
    computed: {
        ...mapGetters({
            messages: 'getSuggestionMessages',
        }),
        failLoadSuggestionMessage(){
            return (
                this.messages.length == 0 &&
                !this.loading.fetchSuggestion
            )
        },
        messageSatisfaction() {
            const { score, category, icon } = this.satisfaction;
            return `🧠 Satisfacción: ${Number(score * 100).toFixed(0)}% (${category}${icon})`
        },
        hasConversationSentiment() {
            const { conversation_sentiment_id } = this.chat;
            return conversation_sentiment_id != null
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
                this.analyzeSentimentConversation({ optionSentiments: this.sentiments })
            }
        },
        sentiments(value) {
            this.analyzeSentimentConversation({ optionSentiments: value })
        }
    },
    methods: {
        async syncronized(lockKey,callback){
            if(this[lockKey]) return
            this[lockKey] = true
            await callback()
            this[lockKey] = false
        },
        clearSuggestionMessage() {
            this.$store.dispatch('clearSuggestionMessage')
        },
        fetchSuggestionMessage() {
            if (!this.open)
                return
            this.syncronized("_lockSuggestion", async () => {
                try {
                    this.loading.fetchSuggestion = true
                    this.clearSuggestionMessage()
                    await this.$store.dispatch('getSuggestionMessage', {
                        conversationId: this.conversationId,
                        count_responses: 3
                    })
                } catch (error) {
                    console.warn({ error })
                } finally {
                    this.loading.fetchSuggestion = false
                }
            })
        },
        async fetchAgentSentiments() {
            const response = await agentCloud.getSentimentConversation({
                conversation_display_id: this.conversationId
            })
            if (!response.data.status) {
                throw new Error(response)
            }
            return response.data.data
        },
        fetchConversationSentiment() {
            this.syncronized("_lockSentiment", async () => {
                try {
                    this.loading.fetchSentiment = true
                    const { categoria, puntaje, justificacion } = await this.fetchAgentSentiments()
                    let sentiment = this.sentiments.find((item) => item.name == categoria)
                    if (!sentiment) {
                        console.warn({
                            error: "Sentiments not found to list",
                            find: categoria,
                            list: this.sentiments
                        })
                        return
                    }
                    this.satisfaction = {
                        ...this.satisfaction,
                        justification: justificacion,
                        score: puntaje,
                        category: categoria,
                        icon: sentiment.icon
                    }
                    this.$store.dispatch('fetchUpdateSentimentConversation', {
                        conversationId: this.chat.id,
                        score: this.satisfaction.score,
                        justification: this.satisfaction.justification,
                        conversation_sentiment_id: sentiment.id,
                        last_sentiment_analysis: true
                    })
                } catch (error) {
                    console.warn({ error })
                } finally {
                    this.loading.fetchSentiment = false
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
        },
        async fetchListSentiments() {
            try {
                let res = await conversationSentimentsApi.get()
                this.sentiments = res.data
            } catch (error) {
                console.warn({ error })
            }
        },
        overrideLimitMessageIncomming() {
            const { messages, last_sentiment_analysis } = this.chat
            if (!last_sentiment_analysis)
                return true
            let date_last_sentiment_analysis = new Date(last_sentiment_analysis * 1000);
            let length_message = messages.length;
            let messages_evaluate = 0
            let count_message_incoming = 0
            for (let i = (length_message - 1); i >= 0; i--) {
                if (messages_evaluate >= MAX_MESSAGE_EVALUATE)
                    return false
                messages_evaluate++;
                if (
                    messages[i].message_type === MESSAGE_TYPE.INCOMING &&
                    new Date(messages[i].created_at * 1000) > date_last_sentiment_analysis
                ) {
                    count_message_incoming++;
                }
                if (count_message_incoming >= OVERRIDE_LIMIT_MESSAGE_INCOMMING)
                    return true
            }
            return false
        },
        captureSentimentConversation(optionSentiments) {
            const { conversation_sentiment_id, justification, score } = this.chat
            let sentiment = optionSentiments.find((item) => item.id == conversation_sentiment_id)
            if (!sentiment) {
                console.warn({
                    error: "Sentiments not found to list",
                    find: conversation_sentiment_id,
                    list: optionSentiments
                })
                return
            }
            this.satisfaction = {
                ...this.satisfaction,
                justification,
                score,
                category: sentiment.name,
                icon: sentiment.icon
            }
        },
        analyzeSentimentConversation({ optionSentiments }) {
            if (!optionSentiments || !Array.isArray(optionSentiments)) {
                return
            }
            if (this.hasConversationSentiment && !this.overrideLimitMessageIncomming()) {
                this.captureSentimentConversation(optionSentiments)
                return
            }
            this.fetchConversationSentiment()
        },
        onMessageIncomig() {
            if(!this.open) return
            this.fetchSuggestionMessage()
            this.analyzeSentimentConversation({ optionSentiments: this.sentiments })
        }
    },
    created() {
        this.$emitter.on(BUS_EVENTS.MESSAGE_INCOMING, this.onMessageIncomig);
    },
    beforeDestroy() {
        this.$emitter.off(BUS_EVENTS.MESSAGE_INCOMING, this.onMessageIncomig)
    },
    mounted() {
        this.fetchListSentiments();
    }
}
</script>
<template>
    <div v-if="open" class="conversation-message-suggestion">
        <div class="flex items-center justify-between">
            <template v-if="loading.fetchSentiment">
                <span class="mx-auto mt-4 mb-4 spinner" />
            </template>
            <template v-else>
                <h3 class="text-sm cursor-pointer">
                    {{ messageSatisfaction }}
                </h3>
            </template>
            <woot-button 
                variant="clear" 
                color-scheme="secondary"
                icon="loading" 
                :disabled="loading.fetchSentiment"
                @click="fetchConversationSentiment" 
            />
        </div>
        <div class="flex items-center justify-between">
            <h3 class="text-sm">{{ $t('CONVERSATION.REPLYBOX.SUGGESTION.TITLE')}}</h3>
            <woot-button 
                variant="clear" 
                color-scheme="secondary"
                icon="loading" 
                :disabled="loading.fetchSuggestion"
                @click="fetchSuggestionMessage" 
            />
        </div>
        <hr class="separator"/>
        <div class="flex flex-col gap-2">
            <div v-if="loading.fetchSuggestion" class="text-center">
                <span class="mt-4 mb-4 spinner" />
            </div>
            <div v-for="(message, index) in messages" :key="index"
                class="bg-primary py-1 px-2 rounded-md cursor-pointer text-sm" 
                @click="clickSelectedMessageSuggestion(message, index)"
                :class="classActiveSuggestionMessage(index)"
                >
                <small>{{ message }}</small>
            </div>
            <div v-if="failLoadSuggestionMessage" class="text-center mt-2 text-sm">
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