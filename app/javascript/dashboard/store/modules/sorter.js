import * as MutationHelpers from 'shared/helpers/vuex/mutationHelpers';
import types from '../mutation-types';
import AnalyticsHelper from '../../helper/AnalyticsHelper';
import { SORTER_EVENTS } from '../../helper/AnalyticsHelper/events';
import SorterAPI from '../../api/sorter';

export const state = {
    records: [],
    uiFlags: {
        isFetching: false,
        isFetchingItem: false,
        isCreating: false,
        isDeleting: false,
    },
};

export const getters = {
    getSorters(_state) {
        return _state.records;
    },
    getUIFlags(_state) {
        return _state.uiFlags;
    }
}

export const mutations = {
    [types.SET_SORTER_UI_FLAG](_state, data) {
        _state.uiFlags = {
            ..._state.uiFlags,
            ...data,
        };
    },
    [types.SET_SORTERS]: MutationHelpers.set,
    [types.ADD_SORTER]: MutationHelpers.create,
    [types.EDIT_SORTER]: MutationHelpers.update,
    [types.DELETE_SORTER]: MutationHelpers.destroy,
};

export const actions = {
    get: async function getSorter({ commit }) {
        commit(types.SET_SORTER_UI_FLAG, { isFetching: true });
        try {
            console.log({
                resource: SorterAPI.resource,
                options: SorterAPI.options,
                url: SorterAPI.url
            })
            const response = await SorterAPI.get();
            const sortedSorter = response.data.payload.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            commit(types.SET_SORTERS, sortedSorter);
        } finally {
            commit(types.SET_SORTER_UI_FLAG, { isFetching: false });
        }
    },
    create: async function createSorter({ commit }, sorter) {
        commit(types.SET_SORTER_UI_FLAG, { isCreating: true });
        try {
            const response = await SorterAPI.create(sorter)
            AnalyticsHelper.track(SORTER_EVENTS.CREATE);
            commit(types.ADD_SORTER, response.data);
        } catch (error) {
            const errorMessage = error?.response?.data?.message;
            throw new Error(errorMessage);
        } finally {
            commit(types.SET_SORTER_UI_FLAG, { isCreating: false });
        }
    },
    update: async function updateSorter({ commit }, { id, ...sorter }) {
        commit(types.SET_SORTER_UI_FLAG, { isUpdating: true });
        try {
            const response = await SorterAPI.update(id, sorter);
            AnalyticsHelper.track(SORTER_EVENTS.UPDATE);
            commit(types.EDIT_SORTER, response.data);
        } catch (error) {
            throw new Error(error);
        } finally {
            commit(types.SET_SORTER_UI_FLAG, { isUpdating: false });
        }
    },
    delete: async function deleteSorter({ commit }, id) {
        commit(types.SET_SORTER_UI_FLAG, { isDeleting: true });
        try {
            await SorterAPI.delete(id);
            AnalyticsHelper.track(SORTER_EVENTS.DELETED);
            commit(types.DELETE_SORTER, id);
        } catch (error) {
            throw new Error(error);
        } finally {
            commit(types.SET_SORTER_UI_FLAG, { isDeleting: false });
        }
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};