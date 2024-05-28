import Router from 'koa-router';
import { generateResponse, listMessagesService, readMessageService, saveMessageService } from '../service/message';

export const saveMessage: Router.IMiddleware = async (ctx, next) => {
  const { message } = ctx.request.body;
  const saved = await saveMessageService(message);

  ctx.body = {
    message: saved,
  };

  next();
};

export const listMessage: Router.IMiddleware = async (ctx, next) => {
  const list = await listMessagesService(ctx.request.body.params);
  ctx.body = {
    list,
  };

  next();
};

export const respondMessage: Router.IMiddleware = async (ctx, next) => {
  const { message_id } = ctx.request.body;
  const message = await readMessageService(message_id);

  if (message == null) {
    throw new Error('Relative message not found')
  }

  const response = await generateResponse(message);

  const saved = await saveMessageService(response);

  ctx.body = {
    message: saved,
  };
  next();
};
