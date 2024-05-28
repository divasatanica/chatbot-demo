import { readListFromDB, saveDataToDB, readFromDB } from './db';
import { SessionInfo } from '../idl';

export const saveSessionService = async (data: SessionInfo) => {
  return saveDataToDB<SessionInfo>('session', data);
};

export const listSessionService = async (params: any) => {
  return readListFromDB<SessionInfo>('session', (session) => {
    let res = true;
    if (params.current) {
      res = res && session.current.id === params.current;
    }
    if (params.opponent) {
      res = res && session.opponent.id === params.opponent;
    }
    return res;
  });
};

export const readSessionService = async (id: string) => {
  return readFromDB<SessionInfo>('session', id);
}
