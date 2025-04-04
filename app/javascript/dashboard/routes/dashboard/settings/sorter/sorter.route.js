import { frontendURL } from '../../../../helper/URLHelper';
const SettingsWrapper = () => import('../SettingsWrapper.vue')
const Index = () => import('./Index.vue');

export default {
    routes: [
        {
            path: frontendURL('accounts/:accountId/settings/sorter'),
            component: SettingsWrapper,
            meta: {
                permissions: ['administrator'],
            },
            props: {
                headerTitle: 'SORTER.HEADER',
                icon: 'book-contacts',
                showNewButton: false,
            },
            children: [
                {
                    path: '',
                    redirect: 'list',
                },
                {
                    path: 'list',
                    name: 'sorter_list',
                    component: Index,
                    meta: {
                        permissions: ['administrator'],
                    },
                },
            ],
        },
    ]
}