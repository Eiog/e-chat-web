import { createError, getHeader } from 'h3'
import type { EventHandlerRequest, H3Event } from 'h3'
import type { SafeParseReturnType } from 'zod'

export function paramsError(body: SafeParseReturnType<any, any>) {
  return createError({
    status: 400,
    statusMessage: 'Bad Request',
    message: '参数错误',
    data: body,
  })
}
export function getToken(event: H3Event<EventHandlerRequest>) {
  const token = getHeader(event, 'authorization')
  return token ? token.replace('Bearer ', '') : ''
}
