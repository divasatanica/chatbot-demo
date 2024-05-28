import Router from 'koa-router';
import { listSessionService, readSessionService, saveSessionService } from '../service/session';
import { readUserService } from '../service/user';

export const getSessionById: Router.IMiddleware = async (ctx, next) => {
  const { session_id } = ctx.params;

  const data = await readSessionService(session_id);

  if (data == null) {
    ctx.body = {
      session: null,
    };
    next();
    return;
  }
  const currentUser = await readUserService(data.current.id);
  const opponent = await readUserService(data.opponent.id);
  data.current.name = currentUser.name;
  data.opponent.name = opponent.name;

  console.log('Get:', data, session_id);
  ctx.body = {
    session: data
  };
  next();
};

export const saveSession: Router.IMiddleware = async (ctx, next) => {
  const { session } = ctx.request.body;
  await saveSessionService(session);

  next();
};

export const startSession: Router.IMiddleware = async (ctx, next) => {
  const { current, opponent } = ctx.request.body;

  const existSession = await listSessionService({
    current,
    opponent,
  });

  console.log('[StartSession]', existSession);
  if (existSession.length === 0) {
    const saved = await saveSessionService({
      current: {
        id: current,
        name: '',
      },
      opponent: {
        id: opponent,
        name: '',
      },
      start_at: Date.now(),
      id: '',
    });
    ctx.body = {
      session_id: saved.id,
    };
    next();
    return;
  }

  const [sessionItem] = existSession;

  sessionItem.start_at = Date.now();
  await saveSessionService(sessionItem);

  ctx.body = {
    session_id: sessionItem.id,
  };
  next();
}
