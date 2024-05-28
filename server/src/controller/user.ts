import Router from 'koa-router';
import { listUserService, readUserService, saveUserService } from '../service/user';

export const saveUser: Router.IMiddleware = async (ctx, next) => {
  const { user = {} } = ctx.request.body;
  const { name } = user;
  const existUser = await listUserService({
    name,
  });

  console.log('[SaveUser]', existUser, name);
  if (existUser.length > 0) {
    ctx.body = {
      user: existUser[0],
    }
    next();
    return;
  }

  const saved = await saveUserService(user);

  ctx.body = {
    user: saved,
  }
  next();
};

export const getUser: Router.IMiddleware = async (ctx, next) => {
  const { id } = ctx.request.body;
  const data = await readUserService(id);

  ctx.body = {
    session: data,
  };
  next();
};
