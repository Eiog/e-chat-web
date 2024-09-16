/* eslint-disable no-console */

import { createServer } from 'node:http'
import process from 'node:process'
import { createApp, createError, defineEventHandler, toNodeListener, useBase } from 'h3'
import chatApi from './api/chat.api'
import loginApi from './api/login.api'
import userApi from './api/user.api'
import { dbConnect } from './db'
import { getToken, isObjectId } from './helps'
import { verify } from './jwt'
import { UseChat } from './useChat'

const PORT = Number(process.env.PORT) || 5632

const app = createApp({
  debug: true,
  onError: (error) => {
    console.error('Error:', error)
  },
  onRequest: async (event) => {
    console.log('Request:', event.path)
  },

})
app.use(defineEventHandler(async (event) => {
  try {
    if (event.path !== '/api/login') {
      const token = getToken(event)
      const jwt = await verify(token)
      if (!jwt) {
        throw createError({
          status: 401,
          statusMessage: 'No Permission',
          message: 'Token无效',
        })
      }
      const _id = jwt._id
      if (!isObjectId(_id)) {
        throw createError({
          status: 401,
          statusMessage: 'No Permission',
          message: '_id验证错误',
        })
      }
      event.context._id = jwt._id
    }
  }
  catch {
    throw createError({
      status: 401,
      statusMessage: 'No Permission',
      message: 'Token无效',
    })
  }
}))
app.use(useBase('/api', userApi.handler))
app.use(useBase('/api', loginApi.handler))
app.use(useBase('/api', chatApi.handler))
dbConnect()
const _ = new UseChat()
const server = createServer(toNodeListener(app))
server.listen(PORT, () => {
  console.log(`server is running at http://127.0.0.1:${PORT}/`)
})
