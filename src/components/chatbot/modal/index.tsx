import { create, register, show, useModal } from '@ebay/nice-modal-react';
import { blue } from '@ant-design/colors';
import { CloseOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { ChatModalHeader } from 'shared/components/chat-header';
import { ChatModalAction } from 'shared/components/chat-action';
import { ChatFlow } from 'shared/components/chat-flow';
import { useRequest } from 'ahooks';
import { useAtom } from 'jotai';
import { SessionIdAtom, SessionInfoAtom } from 'shared/store';
import { useCallback, useEffect } from 'react';
import { GetSession, RegisterUser, StartSession } from 'api';

const ChatMainModal = create(() => {
  const modal = useModal();
  const [sessionId, setSessionId] = useAtom(SessionIdAtom);
  const [_, setSessionInfo] = useAtom(SessionInfoAtom);
  const registerUser = useCallback(async (id: string, name: string) => {
    const res = await RegisterUser({
      user: {
        id,
        name,
      },
    });

    return res.data.user;
  }, []);

  /**
   * Get Session Info
   */
  const { run } = useRequest(
    async (_sessionId: string) => {
      if (!_sessionId) {
        return;
      }
      const res = await GetSession({
        session_id: _sessionId,
      });

      if (res.code === 0) {
        setSessionInfo(res.data.session);
      }
    },
    {
      manual: true,
    },
  );

  /**
   * Start new Session
   */
  const { run: startSession } = useRequest(
    async (current: string, opponent: string) => {
      const res = await StartSession({
        current,
        opponent,
      });

      if (res.code === 0) {
        setSessionId(res.data.session_id);
      }
    },
    {
      manual: true,
    },
  );

  useEffect(() => {
    if (sessionId) {
      return;
    }

    /**
     * // TODO Start session
     * Call /chat/session/start
     */
    Promise.all([
      registerUser('', 'Hans Landa'),
      registerUser('', 'Hans Robot'),
    ]).then(([currentUser, opponentUser]) => {
      startSession(currentUser.id, opponentUser.id);
    });
  }, [sessionId]);

  useEffect(() => {
    run(sessionId);
  }, [sessionId, run]);

  console.log('SessionId:', sessionId, _);

  return (
    <Modal
      mask={false}
      title={<ChatModalHeader chatterName={_.opponent?.name} />}
      open={modal.visible}
      destroyOnClose={false}
      maskClosable={false}
      closeIcon={<CloseOutlined className="text-white" />}
      styles={{
        content: {
          padding: '0',
        },
        header: {
          background: blue[6],
        },
        body: {
          background: '#fff',
        },
      }}
      afterClose={() => {
        modal.remove();
      }}
      onCancel={() => {
        modal.hide();
      }}
      footer={<ChatModalAction sessionId={sessionId} />}
    >
      <div className="px-6 overflow-y-auto" style={{ height: 450 }}>
        <ChatFlow sessionId={sessionId} />
      </div>
    </Modal>
  );
});

const id = 'chat-main';
register(id, ChatMainModal);

export function renderChatModal() {
  return show<void>(id);
}
