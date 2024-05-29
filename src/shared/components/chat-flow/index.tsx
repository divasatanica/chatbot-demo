import { useAtom } from 'jotai';
import { useRequest } from 'ahooks';
import { gray } from '@ant-design/colors';
import { MessageListAtom } from 'shared/store';
import { ChatMessage } from '../chat-message';
import { useEffect } from 'react';
import { ListMessages } from 'api';

interface IProps {
  sessionId?: string;
}

/**
 * Component of chat flow, it will render message list
 * and load history messages.
 * @param props.sessionId Id of history session, used to load history messages
 */
export function ChatFlow(props: IProps) {
  const { sessionId = '' } = props;

  const [messageList, setMessageList] = useAtom(MessageListAtom);

  console.log('message', messageList);

  const { run, loading } = useRequest(async (_sessionId: string) => {
    if (!_sessionId) {
      return;
    }
    /**
     * Fetch messages list
     * Call /chat/message/list
     */
    const res = await ListMessages({
      params: {
        session_id: sessionId,
      },
    });

    if (res.code === 0) {
      setMessageList(res.data.list);
    }
  }, {
    manual: true,
  });

  useEffect(() => {
    run(sessionId);
  }, [sessionId, run]);

  return (
    <div className="flex flex-col">
      <section className="text-center">
        <span style={{ color: gray[7], fontSize: 14 }}>
          You can start the chat now!
        </span>
      </section>
      {messageList.map((message) => {
        const { type, content, id, sender, status } = message;
        return (
          <ChatMessage
            status={status}
            senderId={sender}
            key={id}
            type={type}
            content={content}
          />
        );
      })}
      <div id="flow-bottom" />
    </div>
  );
}
