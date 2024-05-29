import Router from 'koa-router';
import { generateResponse, getPendingMessage, listMessagesService, readMessageService, saveMessageService } from '../service/message';
import { Readable, Stream } from 'stream';

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

  const response = getPendingMessage(message);
  const saved = await saveMessageService(response);

  ctx.body = {
    message: saved,
  };
  next();
};

export const generateContent: Router.IMiddleware = async (ctx, next) => {
  const { message_id, respond_id } = ctx.request.query;
  const message = await readMessageService(message_id as string);

  if (message == null) {
    throw new Error('Relative message not found')
  }

  const respondMessage = await readMessageService(respond_id as string);

  if (message == null) {
    throw new Error('Relative respond message not found')
  }

  const response = await generateResponse(message);
  let messageContent = '';

  response.on('data', chunk => {
    messageContent += chunk;
  });

  response.on('end', () => {
    respondMessage.content = messageContent;
    saveMessageService(respondMessage);
  });

  ctx.response.set("content-type", "plain/text");
  ctx.body = response;
  next();
};

