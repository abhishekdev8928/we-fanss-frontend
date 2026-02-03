import { create } from "zustand";

export const usePrivilegeStore = create((set, get) => ({
  role: null,
  accessibleModules: [],
  permissions: [],

  setPrivileges: (data) => {
    set({
      role: data.role || null,
      accessibleModules: data.accessibleModules || [],
      permissions: data.permissions || [],
    });
  },

  clearPrivileges: () => {
    set({
      role: null,
      accessibleModules: [],
      permissions: [],
    });
  },

  // Check if module is accessible
  hasModuleAccess: (module) => {
    return get().accessibleModules.includes(module);
  },

  // ✅ FIXED: operations is an object, not an array
  hasPermission: (resource, operation) => {
    const permission = get().permissions.find((p) => p.resource === resource);
    
    if (!permission) return false;
    
    // ✅ Check if operation exists in operations object and is true
    return permission.operations[operation] === true;
  },
}));