import { atom, createStore } from 'jotai';
import { atomWithImmer } from 'jotai-immer';
import { MessageItem, SessionInfo } from 'shared/types';

export const store = createStore();

export const SessionIdAtom = atom<string>('');

export const SessionInfoAtom = atom<SessionInfo>({
  current: undefined,
  opponent: undefined,
  start_at: undefined,
});

export const MessageListAtom = atomWithImmer<MessageItem[]>([] as MessageItem[]);

export const ServiceBaseURLAtom = atom<string | undefined>(undefined);
