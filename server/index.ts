/* eslint-disable no-console */

import { createServer } from 'node:http'
import process from 'node:process'
import { createApp, eventHandler, toNodeListener, useBase } from 'h3'
import loginApi from './api/login.api'
import userApi from './api/user.api'
import { dbConnect } from './db'

const PORT = Number(process.env.PORT) || 5632

const app = createApp()
const server = createServer(toNodeListener(app))

app.use(useBase('/api', loginApi.handler))
app.use(useBase('/api/user', userApi.handler))
app.use(useBase('/**', eventHandler(() => {
  return 'hello world'
})))
dbConnect()
server.listen(PORT, () => {
  console.log(`server is running at http://127.0.0.1:${PORT}/`)
})
