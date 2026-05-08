/**
 * Centralized helper for icon mapping and normalization.
 * Provides retrocompatibility for old lucide icon names.
 */

export function normalizeIconName(iconName?: string | null): string {
  if (!iconName) return "lucide:circle";
  
  // If it already has a prefix (colon), assume it's a new Iconify format
  if (iconName.includes(":")) return iconName;

  // Retrocompatibility map for old Lucide icon names
  const map: Record<string, string> = {
    Wrench: "lucide:wrench",
    Factory: "mdi:factory",
    Hammer: "lucide:hammer",
    Cog: "lucide:cog",
    Zap: "lucide:zap",
    ShieldCheck: "lucide:shield-check",
    HardHat: "fa6-solid:helmet-safety",
    Settings: "lucide:settings",
    AlignCenterHorizontal: "lucide:align-center-horizontal",
    Contact: "lucide:contact",
    Phone: "lucide:phone",
    Mail: "lucide:mail",
    MessageCircle: "lucide:message-circle",
    Send: "lucide:send",
    MapPin: "lucide:map-pin",
    Tool: "lucide:wrench", // Fallback for Tool
    User: "lucide:user",
    ExternalLink: "lucide:external-link",
  };

  return map[iconName] || `lucide:${iconName.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
}
