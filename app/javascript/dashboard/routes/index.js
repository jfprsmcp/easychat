import VueRouter from 'vue-router';

import { frontendURL } from '../helper/URLHelper';
import dashboard from './dashboard/dashboard.routes';
import store from '../store';
import { validateLoggedInRoutes } from '../helper/routeHelpers';
import AnalyticsHelper from '../helper/AnalyticsHelper';
import { buildPermissionsFromRouter } from '../helper/permissionsHelper';
import EasyContactPolicies from '../../v3/views/Privacy/EasyContactPolicies.vue';
const routes = [...dashboard.routes,
 {
    path: '/app/EasyContactPolicies',
    name: 'EasyContactPolicies',
    component: EasyContactPolicies,
    meta: {
      public: true,
    },
  },
];

export const router = new VueRouter({ mode: 'history', routes });
export const routesWithPermissions = buildPermissionsFromRouter(routes);
 
export const validateAuthenticateRoutePermission = (to, next, { getters }) => {
  const { isLoggedIn, getCurrentUser: user } = getters;
  if (to.path === '/app/EasyContactPolicies') {
    return next();
  }
  if (!isLoggedIn) {
    window.location = '/app/login';
    return '/app/login';
  }

  if (!to.name) {
    return next(frontendURL(`accounts/${user.account_id}/dashboard`));
  }

  const nextRoute = validateLoggedInRoutes(to, getters.getCurrentUser);
  return nextRoute ? next(frontendURL(nextRoute)) : next();
};

export const initalizeRouter = () => {
  const userAuthentication = store.dispatch('setUser');

  router.beforeEach((to, from, next) => {
    AnalyticsHelper.page(to.name || '', {
      path: to.path,
      name: to.name,
    });

    userAuthentication.then(() => {
      return validateAuthenticateRoutePermission(to, next, store);
    });
  });
};

export default router;
