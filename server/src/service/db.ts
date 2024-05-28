import { existsSync } from 'fs';
import { appendFile, readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import uuid from 'uuid-v4';

const getDBFilePath = (table: string) => {
  const path = resolve(__dirname, `../../db/${table}`);

  return [path, existsSync(path)];
};

export const saveDataToDB = async <T extends { id: string } = any>(
  tableName: string,
  data: T,
) => {
  const [csvPath, exists] = getDBFilePath(tableName);

  console.log('CSVPath:', csvPath);

  if (!exists) {
    console.log('WriteFile', csvPath);
    await writeFile(csvPath as string, '', { encoding: 'utf-8' });
  }

  if (!data.id) {
    const result = {
      ...data,
      id: uuid(),
    };
    console.log('Append TO DB', tableName, JSON.stringify(result));
    await appendFile(csvPath as string, `${JSON.stringify(result)}\n`);
    return result;
  } else {
    const csvFile = (
      await readFile(csvPath as string, { encoding: 'utf-8' })
    ).toString();

    const recordList = csvFile.split('\n').filter(Boolean);

    for (let i = 0; i < recordList.length; i++) {
      const item = recordList[i];

      if (item.includes(data.id)) {
        recordList[i] = JSON.stringify(data);
        break;
      }
    }

    console.log('Update TO DB', tableName, JSON.stringify(data));
    await writeFile(csvPath as string, recordList.join('\n'), {
      encoding: 'utf-8',
      flag: 'w+',
    });
    return data;
  }
};

export const readListFromDB = async <T = any>(tableName: string, filter?: (data: T) => boolean) => {
  const [csvPath, exists] = getDBFilePath(tableName);

  console.log('CSVPath:', csvPath);

  if (!exists) {
    return [];
  }

  const csvFile = (
    await readFile(csvPath as string, { encoding: 'utf-8' })
  ).toString();

  const recordList = csvFile.split('\n').filter(Boolean);
  console.log('File:', csvFile, recordList);

  return recordList.map((item) => JSON.parse(item)).filter(filter ?? (() => true)) as T[];
};

export const readFromDB  = async <T extends { id: string }  = any>(tableName: string, id: string) => {
  const [csvPath, exists] = getDBFilePath(tableName);

  if (!exists) {
    return null;
  }

  const csvFile = (await readFile(csvPath as string, { encoding: 'utf-8' })).toString();

  const recordList = csvFile.split('\n').filter(Boolean);
  console.log('File:', csvFile, recordList, id);

  for (let i = 0; i < recordList.length; i ++) {
    const item = recordList[i];

    if (item.includes(id)) {
      return JSON.parse(item) as T;
    }
  }

  return null;
}
