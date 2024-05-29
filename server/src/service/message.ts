import { readFromDB, readListFromDB, saveDataToDB } from './db';
import { MessageItem, MessageStatus } from '../idl';
import { readUserService } from './user';
import { MessageStream } from '../utils/message-stream';
import { Readable } from 'stream';
import { resolve } from 'path';
import { readFileSync } from 'fs';

export const saveMessageService = async (data: MessageItem) => {
  return saveDataToDB<MessageItem>('message', data);
}

export const listMessagesService = async (params: any) => {
  return readListFromDB<MessageItem>('message', message => {
    let res = true;
    if (params.sender) {
      res = res && message.sender === params.sender;
    }
    if (params.session_id) {
      res = res && message.session_id === params.session_id;
    }
    return res;
  });
}

export const readMessageService = async (id: string) => {
  return readFromDB<MessageItem>('message', id);
}

export const getPendingMessage = (message: MessageItem): MessageItem => {
  const { sender, receiver } = message;

  const newMessage: MessageItem = {
    sender: receiver,
    receiver: sender,
    id: '',
    content: '',
    status: MessageStatus.Generating,
    type: '',
    ts: Date.now(),
    session_id: message.session_id,
  };

  return newMessage;
}

/**
 * Here you can generate the message whatever you want, just make sure to return a readable stream.
 * @param message Message item to respond
 * @returns To return a readable stream to support stream generation.
 */
export const generateResponse = async (message: MessageItem): Promise<Readable> => {
  const { sender, content: _content } = message;
  let content: string | Readable = '';

  if (/您好|你好|Hello/gi.test(_content)) {
    const date = new Date();
    const hour = date.getHours();
    const saved = await readUserService(sender);
    const commonString = `您是叫${saved.name}对吗？`;

    if (hour <= 5 && hour > 0) {
      content = `夜深了，要记得休息呀。${commonString}`;
    } else if (hour > 6 && hour <= 12) {
      content = `上午好。${commonString}`;
    } else if (hour > 12 && hour <= 18) {
      content = `下午好。${commonString}`;
    } else {
      content = `晚上好。${commonString}`;
    }
  } else if (/^\/help$/.test(_content)) {
    content = '您可以输入以下命令：\n /time 查询时间 \n /reading 阅读文章';
  } else if (/^\/time$/.test(_content)) {
    const date = new Date();
    content = `现在的时间是 ${date.toLocaleTimeString()}`
  } else if (/^\/reading$/.test(_content)) {
    const articles = ['cn', 'en', 'de'];
    const randomIndex = Math.round(Math.random() * (articles.length - 1));
    const article = articles[randomIndex];
    const _path = resolve(__dirname, `../../material/${article}`);
    content = readFileSync(_path, { encoding: 'utf-8' });
  } else {
    content = '对不起，您说的话我没有理解';
  }

  if (typeof content === 'string') {
    const messageStream = new MessageStream();

    if (/^\/reading$/.test(_content)) {
      messageStream.setCost(10000);
    }

    messageStream.write(content, 'utf-8');
    messageStream.end();
    return messageStream;
  }

  return content as Readable;

}

