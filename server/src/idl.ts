export type MessageType = string;
export enum MessageStatus {
  Loading = 1,
  Done = 2,
  Error = 3,
}

export interface MessageItem {
  type: MessageType;
  content: string;
  ts: number;
  id: string;
  sender: string;
  receiver: string;
  session_id: string;
  status: MessageStatus;
}

export interface UserInfo {
  id: string;
  name: string;
}

export interface SessionInfo {
  id: string;
  current: UserInfo | undefined;
  opponent: UserInfo | undefined;
  start_at: number | undefined;
}
