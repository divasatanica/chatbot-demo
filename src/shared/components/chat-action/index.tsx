import { Input, message } from 'antd';
import { useCallback, useRef } from 'react';
import { useUpdate } from 'ahooks';
import { SendOutlined } from '@ant-design/icons';
import { gray } from '@ant-design/colors';
import { useAtom } from 'jotai';
import { MessageListAtom, SessionInfoAtom } from 'shared/store';
import { uuid } from 'shared/utils';
import { MessageItem, MessageStatus } from 'shared/types';
import { GenerateResponse, RespondMessage, SendMessage } from 'api';

interface IProps {
  sessionId?: string;
}

export function ChatModalAction(props: IProps) {
  const { sessionId = '' } = props;
  const inputValue = useRef<string>('');
  const [_, setMessageList] = useAtom(MessageListAtom);
  const [sessionInfo] = useAtom(SessionInfoAtom);
  const update = useUpdate();
  const scrollToBottom = () => {
    document.getElementById('flow-bottom')?.scrollIntoView();
  }

  const getResponse = useCallback(async (messageId: string) => {
    const res = await RespondMessage({
      message_id: messageId,
    });

    if (res.code !== 0) {
      return;
    }

    setMessageList(messageList => {
      messageList.push(res.data.message);
    });
    scrollToBottom();
    const respondId = res.data.message.id;
    const generateRes = await GenerateResponse({ message_id: messageId, respond_id: respondId });

    const reader = generateRes as ReadableStreamDefaultReader;

    let content = '';

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        setMessageList(messageList => {
          const messageIndex = messageList.findIndex(item => item.id === respondId);
          messageList[messageIndex].status = MessageStatus.Done;
        });
        scrollToBottom();
        break;
      };
      content += value.toString();
      setMessageList(messageList => {
        const messageIndex = messageList.findIndex(item => item.id === respondId);
        messageList[messageIndex].content = content;
      });
      scrollToBottom();
    }

  }, [setMessageList]);

  const onSendMessage = useCallback(async () => {
    if (!sessionId) {
      message.error('Session not initialized!');
      return;
    }

    const messageId = `message-${uuid()}`;
    const newMessage: MessageItem = {
      id: messageId,
      content: inputValue.current,
      sender: sessionInfo.current?.id || '',
      session_id: sessionId,
      status: MessageStatus.Loading,
      ts: Date.now(),
      receiver: sessionInfo.opponent?.id || '',
      type: '',
    };
    setMessageList((messageList) => {
      messageList.push(newMessage);
      messageList.sort((a, b) => a.ts - b.ts);
    });
    inputValue.current = '';
    update();

    /**
     * Send the message to server and get its result.
     * Call /chat/message/send
     */
    try {
      const res = await SendMessage({
        message: {
          ...newMessage,
          status: MessageStatus.Done,
          id: '',
        },
      });

      if (res.code === 0) {
        const messageSent = res.data.message;

        setMessageList((messageList) => {
          const foundIndex = messageList.findIndex(
            (item) => item.id === messageId,
          );

          if (foundIndex < 0) {
            return;
          }

          messageList[foundIndex] = messageSent;
          messageList[foundIndex].status = MessageStatus.Done;

          messageList.sort((a, b) => a.ts - b.ts);
        });

        getResponse(messageSent.id);
      } else {
        throw new Error('Send Failed');
      }
    } catch {
      setMessageList((messageList) => {
        const foundIndex = messageList.findIndex(
          (item) => item.id === messageId,
        );

        if (foundIndex < 0) {
          return;
        }

        messageList[foundIndex].status = MessageStatus.Error;

        messageList.sort((a, b) => a.ts - b.ts);
      });
    }
  }, [getResponse, sessionId, sessionInfo, update, setMessageList]);

  return (
    <div className="p-3" style={{ borderTop: `1px solid ${gray[2]}` }}>
      <section>
        <Input
          onKeyUp={e => {
            if (e.code.toLowerCase() === 'enter') {
              onSendMessage();
            }
          }}
          value={inputValue.current}
          onChange={(val) => {
            inputValue.current = val.target.value;
            update();
          }}
          suffix={
            <section
              className="pl-3 cursor-pointer"
              onClick={onSendMessage}
            >
              <SendOutlined />
            </section>
          }
        />
      </section>
    </div>
  );
}
