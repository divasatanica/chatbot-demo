import { readFromDB, readListFromDB, saveDataToDB } from './db';
import { MessageItem, MessageStatus } from '../idl';
import { readUserService } from './user';

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

export const generateResponse = async (message: MessageItem): Promise<MessageItem> => {
  const { sender, receiver, content } = message;

  const newMessage: MessageItem = {
    sender: receiver,
    receiver: sender,
    id: '',
    content: '',
    status: MessageStatus.Done,
    type: '',
    ts: Date.now(),
    session_id: message.session_id,
  };

  if (/您好|你好|Hello/g.test(content)) {
    const date = new Date();
    const hour = date.getHours();
    const saved = await readUserService(sender);
    const commonString = `您是叫${saved.name}对吗？`;

    if (hour <= 5 && hour > 0) {
      newMessage.content = `夜深了，要记得休息呀。${commonString}`;
    } else if (hour > 6 && hour <= 12) {
      newMessage.content = `上午好。${commonString}`;
    } else if (hour > 12 && hour <= 18) {
      newMessage.content = `下午好。${commonString}`;
    } else {
      newMessage.content = `晚上好。${commonString}`;
    }
  } else if (/^\/help$/.test(content)) {
    newMessage.content = '您可以输入以下命令：\n /time 查询时间';
  } else if (/^\/time$/.test(content)) {
    const date = new Date();
    newMessage.content = `现在的时间是 ${date.toLocaleTimeString()}`
  } else {
    newMessage.content = '对不起，您说的话我没有理解';
  }

  return newMessage;
}

