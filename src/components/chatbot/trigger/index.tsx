import { RobotOutlined } from '@ant-design/icons';
import { Provider as NiceModalProvider } from '@ebay/nice-modal-react';
import { Provider as JotaiProvider } from 'jotai';
import { store } from 'shared/store';
import { blue } from '@ant-design/colors';
import { renderChatModal } from '../modal';
import { useEffect } from 'react';
import { setBaseURL } from 'api';
import { useAttachedToEdge } from 'shared/hooks/use-attached-to-edge';

interface IProps {
  service?: string;
}

export function ChatBotTrigger(props: IProps) {
  const { service } = props;
  const { containerRef, right, bottom } = useAttachedToEdge();

  useEffect(() => {
    if (!service) {
      setBaseURL();
      return;
    }
    setBaseURL(service);
  }, [service]);
  return (
    <NiceModalProvider>
      <JotaiProvider store={store}>
        <div
          ref={containerRef}
          className="flex fixed items-center justify-center cursor-pointer"
          style={{
            borderRadius: '50%',
            width: 32,
            height: 32,
            right,
            bottom,
            background: blue[5],
            boxShadow: `5px 5px 5px rgba(0,0,0,0.2)`,
          }}
          onClick={async () => {
            return renderChatModal();
          }}
        >
          <section className="text-white">
            <RobotOutlined />
          </section>
        </div>
      </JotaiProvider>
    </NiceModalProvider>
  );
}
