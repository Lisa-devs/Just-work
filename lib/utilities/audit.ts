export const KINDS = ["Members", "Tasks", "Files", "Announcements", "Messages", "Code Red", "Sessions", "General"];
export function kindOf(t: string) {
  if (/Code Red|alert|drill/i.test(t)) return "Code Red";
  if (/session|signed out/i.test(t) && !/member/i.test(t)) return "Sessions";
  if (/Announcement/i.test(t)) return "Announcements";
  if (/Task/i.test(t)) return "Tasks";
  if (/file|link|permission/i.test(t)) return "Files";
  if (/invite|approv|reject|role|suspend|reactivat|removed|member/i.test(t)) return "Members";
  if (/group|conversation/i.test(t)) return "Messages";
  return "General";
}
