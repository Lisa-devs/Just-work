// Shapes mirror future Supabase tables. Every row carries orgId (RLS key).
export type Level = "Check on me" | "Threat" | "Emergency";
export type AlertStatus = "sent" | "acknowledged" | "escalated" | "cancelled" | "resolved";
export interface Task { id: string; orgId: string; title: string; assignee: string; due: string; status: "todo"|"progress"|"done"; priority: "low"|"medium"|"high"; description: string }
export interface FileItem { id: string; orgId: string; name: string; size: string; access: string; link?: boolean }
export interface Message { id: string; from: string; text: string; at: number; status: "sent" | "delivered" | "read" }
export interface Conversation { id: string; orgId: string; kind: "direct" | "group"; name: string; members: string[]; retention: "off" | "7d"; messages: Message[] }
export interface Announcement { id: string; orgId: string; title: string; body: string; category: string; author: string; at: number; read: boolean; mine: boolean }
export interface Contact { id: string; name: string; kind: string; country: string; note?: string; checked: string; stale: boolean }
export interface Alert { level: Level; message: string; audience: string; status: AlertStatus; at: number; responders: string[]; location: boolean; delivered: boolean; seen: boolean; events: { text: string; at: number }[] }
export interface Member { orgId: string; id: string; name: string; role: string; status: "pending"|"active"|"suspended"; onCall?: boolean; lastActive: string }
export interface CodeRedConfig { onCall: string[]; instructions: string; levels: Level[]; channels: { email: boolean; sms: boolean }; times: Record<Level, number> }
export interface LogEntry { id: string; text: string; when: string }
