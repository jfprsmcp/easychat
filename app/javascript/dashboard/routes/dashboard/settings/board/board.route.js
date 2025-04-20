import { frontendURL } from '../../../../helper/URLHelper';
const SettingsWrapper = () => import('../SettingsWrapper.vue')
const Index = () => import('./Index.vue');

export default {
    routes: [
        {
            path: frontendURL('accounts/:accountId/settings/board'),
            component: SettingsWrapper,
            meta: {
                permissions: ['administrator'],
            },
            props: {
                headerTitle: 'KANBAN.HEADER',
                icon: 'board',
                showNewButton: false,
            },
            children: [
                {
                    path: '',
                    redirect: 'list',
                },
                {
                    path: 'list',
                    name: 'board_list',
                    component: Index,
                    meta: {
                        permissions: ['administrator'],
                    },
                },
            ],
        },
    ]
}