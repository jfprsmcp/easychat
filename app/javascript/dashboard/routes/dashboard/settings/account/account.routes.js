import { frontendURL } from '../../../../helper/URLHelper';
const SettingsContent = () => import('../Wrapper.vue');
const Index = () => import('./Index.vue');

export default {
  routes: [
    {
      path: frontendURL('accounts/:accountId/settings/general'),
      props: {
        headerTitle: 'GENERAL_SETTINGS.TITLE',
        icon: 'briefcase',
        showNewButton: false,
      },
      meta: {
        permissions: ['administrator'],
      },
      children: [
        {
          path: '',
          name: 'general_settings_index',
          component: Index,
          meta: {
            permissions: ['administrator'],
          },
        },
      ],
      component: SettingsContent,
    },
  ],
};
