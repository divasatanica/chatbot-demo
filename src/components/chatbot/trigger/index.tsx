import { RobotOutlined } from '@ant-design/icons';
import { Provider as NiceModalProvider } from '@ebay/nice-modal-react';
import { Provider as JotaiProvider } from 'jotai';
import { store } from 'shared/store';
import { blue } from '@ant-design/colors';
import { renderChatModal } from '../modal';
import { useEffect } from 'react';
import { setBaseURL } from 'api';

interface IProps {
  service?: string;
}

export function ChatBotTrigger(props: IProps) {
  const { service } = props;

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
          className="flex fixed items-center justify-center cursor-pointer"
          style={{
            borderRadius: '50%',
            width: 32,
            height: 32,
            right: 24,
            bottom: 120,
            background: blue[5],
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
