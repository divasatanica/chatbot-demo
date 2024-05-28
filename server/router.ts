import Router from 'koa-router';
import { listMessage, respondMessage, saveMessage } from './src/controller/message';
import { getSessionById, startSession } from './src/controller/session';
import { saveUser } from './src/controller/user';

export const router = new Router();

router.prefix('/chat');

router.post('/session/start', startSession)
      .post('/message/list', listMessage)
      .post('/message/send', saveMessage)
      .get('/session/get/:session_id', getSessionById)
      .post('/message/respond', respondMessage)
      .post('/user/register', saveUser);

