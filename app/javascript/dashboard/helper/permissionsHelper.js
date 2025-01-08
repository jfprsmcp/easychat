export const hasPermissions = (
  requiredPermissions = [],
  availablePermissions = []
) => {
  return requiredPermissions.some(permission =>
    availablePermissions.includes(permission)
  );
};

const isPermissionsPresentInRoute = route =>
  route.meta && route.meta.permissions;

// Modificar buildPermissionsFromRouter para que ignore las rutas públicas
export const buildPermissionsFromRouter = (routes = []) =>
  routes.reduce((acc, route) => {
    if (route.name) {
      // Asegurarse de que las rutas públicas no requieran permisos
      if (route.meta && route.meta.public) {
        acc[route.name] = [];  // Se asignan permisos vacíos para rutas públicas
      } else if (!isPermissionsPresentInRoute(route)) {
        // Si no hay permisos y no es pública, lanzar el error
        console.error(route);
        throw new Error(
          "The route doesn't have the required permissions defined"
        );
      } else {
        acc[route.name] = route.meta.permissions;
      }
    }

    if (route.children) {
      acc = {
        ...acc,
        ...buildPermissionsFromRouter(route.children),
      };
    }

    return acc;
  }, {});
