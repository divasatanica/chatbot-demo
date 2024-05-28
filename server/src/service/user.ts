import { saveDataToDB, readFromDB, readListFromDB } from './db';
import { UserInfo } from '../idl';

export const saveUserService = async (data: UserInfo) => {
  return saveDataToDB<UserInfo>('user', data);
};

export const readUserService = async (id: string) => {
  return readFromDB<UserInfo>('user', id);
}

export const listUserService = async (params: any) => {
  return readListFromDB<UserInfo>('user', (user) => {
    let res = true;
    console.log('Filter', user, params);
    if (params.name) {
      res = res && user.name === params.name;
    }
    return res;
  });
};
