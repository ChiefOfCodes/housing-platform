export const getRedirectRoute = (role) => {
  switch (role) {
    case "user":
      return "/user/dashboard";

    case "agent":
      return "/agent/dashboard";

    case "owner":              // FIXED (was landlord)
      return "/owner/dashboard";

    case "manager":            // NEW — backend supports manager
      return "/manager/dashboard";

    case "admin":
      return "/dashboard/admin";

    case "guest":
      return "/guest";

    default:
      return "/";
  }
};
