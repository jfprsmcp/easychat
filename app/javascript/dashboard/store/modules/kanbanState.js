import * as MutationHelpers from 'shared/helpers/vuex/mutationHelpers';
import types from '../mutation-types';
import KanbanStatesAPI from '../../api/kanbanStates';
import AnalyticsHelper from '../../helper/AnalyticsHelper';
import { KANBAN_STATE_EVENTS } from '../../helper/AnalyticsHelper/events';
import Vue from 'vue';
export const state = {
  records: [],
  uiFlags: {
    isFetching: false,
  },
};

export const getters = {
  getKanbanState(_state) {
    return _state.records;
  },
  getUIFlags(_state) {
    return _state.uiFlags;
  }
};

export const actions = {
  get: async function getKanbanStates({ commit }) {
    commit(types.SET_KANBAN_STATE_UI_FLAG, { isFetching: true });
    try {
      const response = await KanbanStatesAPI.get();
      commit(types.SET_KANBAN_STATES, response.data.payload);
    } catch (error) {
      console.warn({ error })
    } finally {
      commit(types.SET_KANBAN_STATE_UI_FLAG, { isFetching: false });
    }
  },
  create: async function createKanbanState({ commit }, kanbanState) {
    commit(types.SET_KANBAN_STATE_UI_FLAG, { isCreating: true });
    try {
      const response = await KanbanStatesAPI.create(kanbanState)
      AnalyticsHelper.track(KANBAN_STATE_EVENTS.CREATE);
      commit(types.ADD_KANBAN_STATE, response.data);
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      throw new Error(errorMessage);
    } finally {
      commit(types.SET_KANBAN_STATE_UI_FLAG, { isCreating: false });
    }
  },
  update: async function updateKanbanState({ commit }, { id, ...kanbanState }) {
    commit(types.SET_KANBAN_STATE_UI_FLAG, { isUpdating: true });
    try {
      const response = await KanbanStatesAPI.update(id, kanbanState);
      AnalyticsHelper.track(KANBAN_STATE_EVENTS.UPDATE);
      commit(types.EDIT_KANBAN_STATE, response.data);
    } catch (error) {
      throw new Error(error);
    } finally {
      commit(types.SET_KANBAN_STATE_UI_FLAG, { isUpdating: false });
    }
  },
  updateBatch: async function updateKanbanStateBatch({ commit }, kanban_states) {
    commit(types.SET_KANBAN_STATE_UI_FLAG, { isUpdating: true });
    try {
      await KanbanStatesAPI.updateBatch({ kanban_states });
      AnalyticsHelper.track(KANBAN_STATE_EVENTS.UPDATE);
    } catch (error) {
      throw new Error(error);
    } finally {
      commit(types.SET_KANBAN_STATE_UI_FLAG, { isUpdating: false });
    }
  },
  delete: async function deleteKanbanState({ commit }, id) {
    commit(types.SET_KANBAN_STATE_UI_FLAG, { isDeleting: true });
    try {
      await KanbanStatesAPI.delete(id);
      AnalyticsHelper.track(KANBAN_STATE_EVENTS.DELETED);
      commit(types.DELETE_KANBAN_STATE, id);
    } catch (error) {
      const errorMessage = error?.response?.data?.error;
      throw new Error(errorMessage);
    } finally {
      commit(types.SET_KANBAN_STATE_UI_FLAG, { isDeleting: false });
    }
  },
  updateCount: function updateCount({ commit }, payload) {
    commit(types.UPDATE_COUNT_KANBAN_STATE, payload);
  }
};

export const mutations = {
  [types.SET_KANBAN_STATE_UI_FLAG](_state, data) {
    _state.uiFlags = {
      ..._state.uiFlags,
      ...data,
    };
  },
  [types.SET_KANBAN_STATES]: MutationHelpers.set,
  [types.ADD_KANBAN_STATE]: MutationHelpers.create,
  [types.EDIT_KANBAN_STATE]: MutationHelpers.update,
  [types.DELETE_KANBAN_STATE]: MutationHelpers.destroy,
  [types.UPDATE_COUNT_KANBAN_STATE](_state, payload) {
    const { columnIdIncrement, columnIdDecrement, value } = payload
    let columnIncIndex = _state.records.findIndex((item) => item.id == columnIdIncrement)
    let columnDecIndex = _state.records.findIndex((item) => item.id == columnIdDecrement)
    if (columnIncIndex > -1) {
      Vue.set(_state.records[columnIncIndex], 'count', _state.records[columnIncIndex].count + value);
    }
    if (columnDecIndex > -1) {
      Vue.set(_state.records[columnDecIndex], 'count', _state.records[columnDecIndex].count - value);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
