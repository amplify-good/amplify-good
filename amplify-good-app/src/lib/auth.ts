import Cookies from "js-cookie";

export type Role = "musician" | "nonprofit" | "community";

const COOKIE_KEY = "ampgood_role";
const EMAIL_COOKIE = "ampgood_email";

/** Map demo emails to roles */
const EMAIL_ROLE_MAP: Record<string, Role> = {
  "music@gmail.com": "musician",
  "npo@gmail.com": "nonprofit",
  "fan@gmail.com": "community",
  "event@gmail.com": "community",
};

/** Log in — returns the role if email matches, null otherwise */
export function login(email: string): Role | null {
  const normalized = email.trim().toLowerCase();
  const role = EMAIL_ROLE_MAP[normalized];
  if (!role) return null;

  Cookies.set(COOKIE_KEY, role, { expires: 7 });
  Cookies.set(EMAIL_COOKIE, normalized, { expires: 7 });
  return role;
}

/** Log in from signup — role is already known */
export function signupLogin(role: Role, email: string) {
  Cookies.set(COOKIE_KEY, role, { expires: 7 });
  Cookies.set(EMAIL_COOKIE, email.trim().toLowerCase(), { expires: 7 });
}

const VALID_ROLES: Role[] = ["musician", "nonprofit", "community"];

/** Get current session */
export function getSession(): { role: Role; email: string } | null {
  const rawRole = Cookies.get(COOKIE_KEY);
  const email = Cookies.get(EMAIL_COOKIE);
  if (!rawRole || !email || !VALID_ROLES.includes(rawRole as Role)) return null;
  return { role: rawRole as Role, email };
}

/** Log out */
export function logout() {
  Cookies.remove(COOKIE_KEY);
  Cookies.remove(EMAIL_COOKIE);
}

/** Display name for each demo account */
export function getDisplayName(email: string): string {
  const map: Record<string, string> = {
    "music@gmail.com": "Los Topo Chicos",
    "npo@gmail.com": "Austin Food Bank",
    "fan@gmail.com": "Rachel Torres",
    "event@gmail.com": "David Chen",
  };
  return map[email] || email;
}

/** All demo accounts for reference */
export const DEMO_ACCOUNTS = [
  { email: "music@gmail.com", role: "musician" as Role, name: "Los Topo Chicos" },
  { email: "npo@gmail.com", role: "nonprofit" as Role, name: "Austin Food Bank" },
  { email: "fan@gmail.com", role: "community" as Role, name: "Rachel Torres" },
  { email: "event@gmail.com", role: "community" as Role, name: "David Chen" },
];
