export const roleCanDelete = (role) => role === "admin" || role ===
"manager";
export const roleCanManageDeals = (role) => role === "admin" || role ===
"manager";
export const roleIsAdmin = (role) => role === "admin";