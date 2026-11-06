// PROTOTYPE DATA ONLY. Replace with Supabase queries (RLS-enforced) later.
import { ago, H, D } from "@/lib/utilities/time";
import type { Conversation, Announcement, Task, FileItem, Contact, Member, LogEntry } from "@/lib/types";
const orgId = "org_savanna";
export const org = { id: orgId, name: "Savanna Climate Network" };
export const tasks: Task[] = [
 { id:"t1", orgId, title:"Prepare briefing pack", assignee:"You", due:"Friday", status:"todo", priority:"high", description:"Compile the Saturday training briefing: agenda, safety guidance, partner contacts." },
 { id:"t2", orgId, title:"Confirm training venue", assignee:"You", due:"Thursday", status:"todo", priority:"medium", description:"Confirm the venue, access and a back-up location." },
 { id:"t3", orgId, title:"Update partner list for Benin", assignee:"Chidi", due:"Monday", status:"todo", priority:"low", description:"Check partner organisations in Benin are still active and reachable." }];
export const files: FileItem[] = [
 { id:"f1", orgId, name:"Briefing pack v2.pdf", size:"1.2 MB", access:"My team" },
 { id:"f2", orgId, name:"Partner list.xlsx", size:"84 KB", access:"Only me" }];
export const contacts: Contact[] = [
 { id:"c1", name:"Legal aid desk, Lagos", kind:"Legal aid", country:"Nigeria", note:"Call from a personal phone, not an office line.", checked:"12 Aug 2026", stale:false },
 { id:"c2", name:"Digital security helpline", kind:"Support", country:"Regional", checked:"20 Jul 2025", stale:true }];
export const members: Member[] = [
 { orgId, id:"u0", name:"Ngozi", role:"Member", status:"pending", lastActive:"Never" },
 { orgId, id:"u1", name:"Amina", role:"Organization admin", status:"active", onCall:true, lastActive:"Today" },
 { orgId, id:"u2", name:"Chidi", role:"Organization admin", status:"active", onCall:true, lastActive:"Today" },
 { orgId, id:"u3", name:"Tunde", role:"Team manager", status:"active", lastActive:"Today" },
 { orgId, id:"u4", name:"Kemi", role:"Member", status:"active", lastActive:"Today" }];
export const auditSeed: LogEntry[] = [
 { id: "a1", text: "Chidi approved Ngozi", when: "Today, 09:12" },
 { id: "a2", text: "Member invited: Ngozi", when: "Today, 08:50" },
 { id: "a3", text: "Task completed: Confirm training venue", when: "Yesterday, 17:40" },
 { id: "a4", text: "Tunde created a share link (file permission: link)", when: "Yesterday, 16:20" },
 { id: "a5", text: "Announcement created", when: "Yesterday, 14:02" },
 { id: "a6", text: "Role changed: Tunde is now Team manager", when: "Yesterday, 12:30" },
 { id: "a7", text: "A member was removed. All devices signed out", when: "Yesterday, 11:05" },
 { id: "a8", text: "Code Red drill alert simulated", when: "19 days ago" },
 { id: "a9", text: "Session revoked (simulated)", when: "20 days ago" }];

export const orgs = [org, { id: "org_harbor", name: "Harbor Rights Collective" }];
tasks.push(
 { id:"h1", orgId:"org_harbor", title:"Draft statement on detention case", assignee:"You", due:"Wednesday", status:"todo", priority:"high", description:"Draft a public statement after legal review." },
 { id:"h2", orgId:"org_harbor", title:"Book legal observer volunteers", assignee:"Efe", due:"Friday", status:"todo", priority:"medium", description:"" });
files.push({ id:"hf1", orgId:"org_harbor", name:"Case timeline.docx", size:"220 KB", access:"Only me" });
members.push(
 { orgId:"org_harbor", id:"h0", name:"Efe", role:"Organization admin", status:"active", onCall:true, lastActive:"Today" },
 { orgId:"org_harbor", id:"h1", name:"Zainab", role:"Member", status:"active", lastActive:"Today" },
 { orgId:"org_harbor", id:"h2", name:"Musa", role:"Member", status:"pending", lastActive:"Never" });

// Seeds are functions so timestamps are relative to "now". Message content lives only in memory.
const m = (id: string, from: string, text: string, at: number, status: "sent" | "delivered" | "read" = "read") => ({ id, from, text, at, status });
export const seedConvos = (): Conversation[] => [
 { id: "c1", orgId: "org_savanna", kind: "group", name: "Organizers group", members: ["You", "Chidi", "Tunde"], retention: "off", messages: [
   m("a", "Chidi", "Reminder: send me your slides before the call.", ago(9 * D)), m("b", "Chidi", "The venue is confirmed for Saturday.", ago(3 * H)), m("c", "You", "Great, thank you.", ago(2 * H), "delivered")] },
 { id: "c2", orgId: "org_savanna", kind: "direct", name: "Chidi", members: ["You", "Chidi"], retention: "off", messages: [m("d", "Chidi", "Can you check the briefing pack?", ago(5 * H))] },
 { id: "c3", orgId: "org_harbor", kind: "group", name: "Case team", members: ["You", "Efe", "Zainab"], retention: "off", messages: [m("e", "Efe", "Hearing moved to Thursday.", ago(4 * H)), m("f", "You", "Noted. I will update the timeline.", ago(3 * H), "sent")] },
 { id: "c4", orgId: "org_harbor", kind: "direct", name: "Efe", members: ["You", "Efe"], retention: "off", messages: [] }];
export const seedAnns = (): Announcement[] => [
 { id: "n1", orgId: "org_savanna", title: "Training moves to Saturday at 10:00", body: "Bring your phone charged and your PIN set. We will run a Code Red drill after lunch.", category: "Training", author: "Amina", at: ago(1 * D), read: false, mine: false },
 { id: "n2", orgId: "org_savanna", title: "New safety directory entries", body: "Chidi added two verified legal aid contacts. Check the last-verified date before sharing sensitive information.", category: "Safety", author: "Chidi", at: ago(3 * D), read: true, mine: false },
 { id: "n3", orgId: "org_savanna", title: "Coalition statement draft open for comments", body: "Please read the draft in Files and add comments by Friday.", category: "Campaign", author: "You", at: ago(5 * D), read: true, mine: true },
 { id: "n4", orgId: "org_harbor", title: "Court observer schedule published", body: "Volunteers: confirm your slots with Efe by Wednesday.", category: "Campaign", author: "Efe", at: ago(2 * D), read: false, mine: false },
 { id: "n5", orgId: "org_harbor", title: "Reminder: complete your Code Red drill", body: "Every member should finish the drill this month.", category: "Safety", author: "Efe", at: ago(6 * D), read: true, mine: false }];

export const defaultCodeRed: Record<string, import("@/lib/types").CodeRedConfig> = {
 org_savanna: { onCall: ["Amina", "Chidi", "Tunde"], levels: ["Check on me", "Threat", "Emergency"], channels: { email: true, sms: false }, times: { "Check on me": 30, Threat: 10, Emergency: 3 }, instructions: "Acknowledge so others know it is handled.\nTry to reach the person by phone.\nUse the safety directory to contact a lawyer.\nIf nobody can help, escalate." },
 org_harbor: { onCall: ["Efe", "Zainab"], levels: ["Check on me", "Threat", "Emergency"], channels: { email: true, sms: true }, times: { "Check on me": 20, Threat: 10, Emergency: 5 }, instructions: "Acknowledge first.\nCall the person.\nContact the legal aid desk.\nEscalate if no answer." } };
