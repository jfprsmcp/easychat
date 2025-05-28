import ApiClient from './ApiClient';

class ConversationSentimentsApi extends ApiClient {
    constructor() {
        super('conversation_sentiments', { accountScoped: true });
    }
}

export default new ConversationSentimentsApi();