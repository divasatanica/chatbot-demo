import { useAtom } from 'jotai';
import { blue, grey, red } from '@ant-design/colors';
import { LoadingOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { RandomAvatar } from 'react-random-avatars';
import { SessionInfoAtom } from 'shared/store';
import { MessageStatus, MessageType } from 'shared/types';
import { classNames } from 'shared/utils';

interface IProps {
  senderId: string;
  type: MessageType;
  content: string;
  status: MessageStatus;
}

export function ChatMessage(props: IProps) {
  const { senderId, content, status } = props;
  const [sessionInfo, _] = useAtom(SessionInfoAtom);

  const isFromSelf = senderId === sessionInfo?.current?.id;

  return (
    <section
      className={classNames(
        isFromSelf ? 'self-end' : 'self-start',
        'flex',
        isFromSelf ? 'flex-row' : 'flex-row-reverse',
        'mb-1',
      )}
      style={{ maxWidth: '70%' }}
    >
      {status === MessageStatus.Loading ? (
        <section className="flex items-center">
          <LoadingOutlined />
        </section>
      ) : null}
      {status === MessageStatus.Error ? (
        <section className="flex items-center">
          <CloseCircleOutlined style={{ color: red[5] }} />
        </section>
      ) : null}
      <section
        className="rounded mx-2 px-2 py-1 flex items-center"
        style={{ background: isFromSelf ? blue[1] : grey[1] }}
      >
        <pre style={{ whiteSpace: 'break-spaces' }}>{content}</pre>
      </section>
      <section className="rounded-circle" style={{ width: 40, height: 40 }}>
        <RandomAvatar
          mode="colors"
          name={
            isFromSelf
              ? `${sessionInfo.current?.id}-from`
              : `${sessionInfo.opponent?.id}-to`
          }
        />
      </section>
    </section>
  );
}
