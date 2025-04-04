import ApiClient from "./ApiClient";

class SorterAPI extends ApiClient {
  constructor() {
    super('conversation_states', { accountScoped: true });
  }
}

export default new SorterAPI();