/* global axios */
import ApiClient from "./ApiClient";

class AgentCloud extends ApiClient {
  constructor() {
    super('agents_cloud', { accountScoped: true });
  }
  getSuggestionMessage({ conversation_display_id, count_responses }) {
    return axios.get(`${this.url}/suggestion_message`, {
      params: {
        conversation_display_id,
        count_responses,
        account_id: this.accountIdFromRoute,
      }
    });
  }
  getSentimentConversation({ conversation_display_id }) {
    return axios.get(`${this.url}/analize_conversation_sentiment`, {
      params: {
        conversation_display_id,
        account_id: this.accountIdFromRoute,
      }
    });
  }
}

export default new AgentCloud();
