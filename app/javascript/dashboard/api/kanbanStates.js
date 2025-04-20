import ApiClient from "./ApiClient";
class KanbanStatesAPI extends ApiClient {
  constructor() {
    super('kanban_states', { accountScoped: true });
  }
  updateBatch(data) {
    return axios.put(`${this.url}/update_order_batch`, data)
  }
}

export default new KanbanStatesAPI();
