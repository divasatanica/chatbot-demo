import { sleep } from "shared/utils";

const BASE_URL = 'http://localhost:3000/chat';

let baseURL = BASE_URL;

export function setBaseURL(url = BASE_URL) {
  baseURL = url;
}

const fetchAPI = async (url: string, params: RequestInit & { timeout?: number }) => {
  const abortController = new AbortController();
  const _params: RequestInit = {
    ...params,
    signal: abortController.signal,
  };
  const { timeout = 15000 } = params;
  if (params?.method?.toLowerCase() === 'get') {
    const mockUrl = new URL(`${baseURL}${url}`);
    const { body = '{}', ...rest } = _params;
    const _body = JSON.parse(body as string) as any;
    Object.keys(_body).forEach((key) => {
      const value = _body[key];
      mockUrl.searchParams.append(key, value as string);
      mockUrl.searchParams.append('_', `${Date.now()}`);
    });

    const result = await Promise.race([
      sleep(timeout),
      fetch(mockUrl, rest),
    ]);

    if (result == null) {
      abortController.abort();
      return Promise.reject(`Timeout Exceeded ${timeout}ms`);
    }

    return (result as Response).json();
  }

  const result = await Promise.race([
    fetch(`${baseURL}${url}?_=${Date.now()}`, _params),
    sleep(timeout),
  ]);
  return (result as Response).json();
}

export const StartSession = (params: any) => {
  return fetchAPI('/session/start', {
    body: JSON.stringify(params),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
};

export const GetSession = (params: any) => {
  return fetchAPI(`/session/get/${params.session_id}`, {
    body: '{}',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
};

export const RegisterUser = (params: any) => {
  return fetchAPI(`/user/register`, {
    body: JSON.stringify(params),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
};

export const SendMessage = (params: any) => {
  return fetchAPI(`/message/send`, {
    body: JSON.stringify(params),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const RespondMessage = (params: any) => {
  return fetchAPI(`/message/respond`, {
    body: JSON.stringify(params),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const ListMessages = (params: any) => {
  return fetchAPI(`/message/list`, {
    body: JSON.stringify(params),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

