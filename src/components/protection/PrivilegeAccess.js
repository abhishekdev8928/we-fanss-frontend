import { usePrivilegeStore } from "../../config/store/privilegeStore";

/**
 * PrivilegeAccess Component - Renders UI elements based on user privileges
 * 
 * @param {Object} props
 * @param {string} props.module - Module name to check access for
 * @param {string} props.resource - Resource name for permission check
 * @param {string} props.action - Action type (e.g., 'add', 'edit', 'delete')
 * @param {React.ReactNode} props.children - UI elements to render if user has privilege
 * @param {React.ReactNode} props.fallback - Optional UI to render if user lacks privilege
 * @param {boolean} props.requireBoth - If true, requires both module AND permission. If false, requires either (default: false)
 * 
 * @example
 * // Render button only if user can add celebrities
 * <PrivilegeAccess resource="celebrity" action="add">
 *   <Button>Add Celebrity</Button>
 * </PrivilegeAccess>
 * 
 * @example
 * // Render delete button only if user can delete
 * <PrivilegeAccess resource="celebrity" action="delete">
 *   <Button color="danger">Delete</Button>
 * </PrivilegeAccess>
 * 
 * @example
 * // Show entire section only if module accessible
 * <PrivilegeAccess module="admin">
 *   <AdminDashboard />
 * </PrivilegeAccess>
 * 
 * @example
 * // With fallback UI
 * <PrivilegeAccess resource="premium" fallback={<UpgradeBanner />}>
 *   <PremiumFeatures />
 * </PrivilegeAccess>
 */
const PrivilegeAccess = ({ 
  module, 
  resource, 
  action, 
  children, 
  fallback = null,
  requireBoth = false 
}) => {
  const { hasModuleAccess, hasPermission } = usePrivilegeStore();

  let hasAccess = false;

  if (module && resource && action) {
    const moduleAccess = hasModuleAccess(module);
    const permissionAccess = hasPermission(resource, action);
    
    hasAccess = requireBoth 
      ? moduleAccess && permissionAccess
      : moduleAccess || permissionAccess;
  } else if (module) {
    hasAccess = hasModuleAccess(module);
  } else if (resource && action) {
    hasAccess = hasPermission(resource, action);
  } else {
    console.warn("PrivilegeAccess used without module or permission props");
    hasAccess = false;
  }

  return hasAccess ? children : fallback;
};

export default PrivilegeAccess;