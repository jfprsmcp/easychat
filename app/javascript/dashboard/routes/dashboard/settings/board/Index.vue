<script setup>
import Draggable from "vuedraggable";
import { useStoreGetters, useStore } from 'dashboard/composables/store';
import { useI18n } from 'dashboard/composables/useI18n';
import { computed, ref, onBeforeMount } from 'vue';
import SettingsLayout from '../SettingsLayout.vue';
import BaseSettingsHeader from '../components/BaseSettingsHeader.vue';
import AddState from "./AddState.vue";
import { useAlert } from 'dashboard/composables';
import EditState from "./EditState.vue";

const { t } = useI18n();
const getters = useStoreGetters();
const store = useStore();

const records = computed(() => getters['kanbanState/getKanbanState'].value);
const uiFlags = computed(() => getters['kanbanState/getUIFlags'].value);
const deleteMessage = computed(() => ` ${selectedLabel.value.name}?`);

const showAddPopup = ref(false);
const showEditPopup = ref(false);
const showDeleteConfirmationPopup = ref(false);
const selectedLabel = ref({});
const loading = ref({});

const openAddPopup = () => {
    showAddPopup.value = true;
};

const hideAddPopup = () => {
    showAddPopup.value = false;
};

const openEditPopup = value => {
    showEditPopup.value = true;
    selectedLabel.value = value;
};

const hideEditPopup = () => {
    showEditPopup.value = false;
};

const openDeletePopup = value => {
    showDeleteConfirmationPopup.value = true;
    selectedLabel.value = value;
};

const closeDeletePopup = () => {
    showDeleteConfirmationPopup.value = false;
};

const deleteState = async id => {
    try {
        await store.dispatch('kanbanState/delete', id);
        useAlert(t('BOARD.DELETE.API.SUCCESS_MESSAGE'));
    } catch (error) {
        const errorMessage = error?.message || t('BOARD.DELETE.API.ERROR_MESSAGE');
        useAlert(errorMessage);
    } finally {
        loading.value = { ...loading.value, [selectedLabel.value.id]: false };
    }
};

const confirmDeletion = () => {
    loading.value[selectedLabel.value.id] = true;
    closeDeletePopup();
    deleteState(selectedLabel.value.id);
}

const reverseOrder = (e) => {
    let list = e.from.__vue__.list
    let state = e.item._underlying_vm_
    list.splice(e.newIndex, 1)
    list.splice(e.oldIndex, 0, state)
}

const getStateMinorChange = (e) => {
    const { newIndex, oldIndex } = e
    return (oldIndex < newIndex) ? oldIndex : newIndex;
}

const getStatesChanged = (e) => {
    let start = getStateMinorChange(e)
    return records.value.reduce((acc, item, index) => {
        if (index >= start)
            acc.push({ ...item, order: index });
        return acc
    }, [])
}

const onChangeOrder = (e) => {
    try {
        let statesUpdate = getStatesChanged(e)
        store.dispatch('kanbanState/updateBatch', statesUpdate);
    } catch (error) {
        reverseOrder(e)
    }
}

onBeforeMount(() => {
    store.dispatch('kanbanState/get');
});

</script>

<template>
    <SettingsLayout :is-loading="uiFlags.isFetching" :loading-message="$t('BOARD.LOADING')"
        :no-records-found="!records.length" :no-records-message="$t('BOARD.LIST.404')">
        <template #header>
            <BaseSettingsHeader :title="$t('BOARD.HEADER')" :description="$t('BOARD.DESCRIPTION')"
                :link-text="$t('BOARD.LEARN_MORE')" feature-name="labels">
                <template #actions>
                    <woot-button class="button nice rounded-md" icon="add-circle" @click="openAddPopup">
                        {{ $t('BOARD.HEADER_BTN_TXT') }}
                    </woot-button>
                </template>
            </BaseSettingsHeader>
        </template>
        <template #body>
            <table class="min-w-full overflow-x-auto divide-y divide-slate-75 dark:divide-slate-700">
                <thead>
                    <th v-for="thHeader in $t('BOARD.LIST.TABLE_HEADER')" :key="thHeader"
                        class="py-4 ltr:pr-4 rtl:pl-4 text-left font-semibold text-slate-700 dark:text-slate-300">
                        {{ thHeader }}
                    </th>
                </thead>
                <Draggable :list="records" group="states" tag="tbody" @update="onChangeOrder" draggable=".dragable">
                    <tr v-for="(kanbanState, index) in records" :key="kanbanState.name" class="cursor-pointer"
                        :class="{ 'dragable': (kanbanState.order != 0) }">
                        <td class="py-4 ltr:pr-4 rtl:pl-4">
                            <span class="font-medium break-words text-slate-700 dark:text-slate-100 mb-1">
                                {{ kanbanState.name }}
                            </span>
                        </td>
                        <td class="leading-6 py-4 ltr:pr-4 rtl:pl-4">
                            <div class="flex items-center">
                                <span
                                    class="rounded h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1 border border-solid border-slate-50 dark:border-slate-700"
                                    :style="{ backgroundColor: kanbanState.color }" />
                                {{ kanbanState.color }}
                            </div>
                        </td>
                        <td class="py-4 min-w-xs">
                            <div class="flex gap-1">
                                <woot-button v-tooltip.top="$t('BOARD.FORM.EDIT')" variant="smooth" size="tiny"
                                    color-scheme="secondary" class-names="grey-btn"
                                    :is-loading="loading[kanbanState.id]" icon="edit"
                                    @click="openEditPopup(kanbanState)" />
                                <woot-button v-if="kanbanState.order != 0" v-tooltip.top="$t('BOARD.FORM.DELETE')"
                                    variant="smooth" color-scheme="alert" size="tiny" icon="dismiss-circle"
                                    class-names="grey-btn" :is-loading="loading[kanbanState.id]"
                                    @click="openDeletePopup(kanbanState, index)" />
                            </div>
                        </td>
                    </tr>
                </Draggable>
            </table>
        </template>

        <woot-modal :show.sync="showAddPopup" :on-close="hideAddPopup">
            <AddState @close="hideAddPopup" />
        </woot-modal>

        <woot-modal :show.sync="showEditPopup" :on-close="hideEditPopup">
            <EditState :selected-response="selectedLabel" @close="hideEditPopup" />
        </woot-modal>

        <woot-delete-modal :show.sync="showDeleteConfirmationPopup" :on-close="closeDeletePopup"
            :on-confirm="confirmDeletion" :title="$t('BOARD.DELETE.CONFIRM.TITLE')"
            :message="$t('BOARD.DELETE.CONFIRM.MESSAGE')" :message-value="deleteMessage"
            :confirm-text="$t('BOARD.DELETE.CONFIRM.YES')" :reject-text="$t('BOARD.DELETE.CONFIRM.NO')" />
    </SettingsLayout>
</template>
