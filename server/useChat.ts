/* eslint-disable no-console */
import { nanoid } from 'nanoid'
import { WebSocketServer } from 'ws'
import type { IncomingMessage } from 'node:http'
import type { WebSocket } from 'ws'

interface Options {
  path?: string
  port?: number
}
interface User {
  id: string
  name: string
}
interface MessageReceive {
  user?: User
  target?: User
  content: string
}
interface MessageDispatch {
  type: 'system' | 'message'
  status: 'error' | 'success'
  user?: User
  target?: User
  content: string
  extra?: {
    [key: string]: any
    _id?: string
    timestamp?: number
  }
}
export class UseChat {
  public options: Options = {
    path: '/_chat',
    port: 5631,
  }

  public wss: WebSocketServer | null = null
  public connections = new Map<WebSocket, { _id: string, headers: IncomingMessage['headers'] }>()
  constructor(options?: Options) {
    if (options) {
      Object.assign(this.options, options)
    }
    const { path, port } = this.options
    this.wss = new WebSocketServer({ path, port }, () => {
      console.log(`socket is running at http://127.0.0.1:${port}${path}`)
    })
    this.wss.on('connection', this.onConnection.bind(this))
    this.wss.on('error', this.onError.bind(this))
  }

  onConnection(socket: WebSocket, request: IncomingMessage) {
    const headers = request.headers
    const _id = headers['sec-websocket-protocol']?.replace('_id-', '')
    if (!_id) {
      socket.close()
      return
    }
    this.connections.set(socket, { _id, headers })
    this.broadcast({
      type: 'system',
      status: 'success',
      target: {
        id: _id,
        name: _id,
      },
      content: `client connected ${_id}`,
    })
    this.sendMessage(socket, {
      type: 'system',
      status: 'success',
      content: 'connect ok',
    })
    socket.on('close', () => {
      this.connections.delete(socket)
      this.broadcast({
        type: 'system',
        status: 'success',
        target: {
          id: _id,
          name: _id,
        },
        content: `client disconnected ${_id}`,
      })
    })
    socket.on('message', (data) => {
      const { user, target, content } = JSON.parse(data.toString()) as MessageReceive
      const targetMap = Array.from(this.connections).find(([_, { _id }]) => _id === target?.id)
      if (targetMap) {
        const targetSocket = targetMap[0]
        this.sendMessage(targetSocket, {
          type: 'message',
          status: 'success',
          user,
          target,
          content,
        }).then(() => {
          this.sendMessage(socket, {
            type: 'system',
            status: 'success',
            content: 'send ok',
          })
        }).catch((err) => {
          this.sendMessage(socket, {
            type: 'system',
            status: 'error',
            content: `socket send error${JSON.stringify(err)}`,
          })
        })
      }
      else {
        this.sendMessage(socket, {
          type: 'system',
          status: 'error',
          content: 'target not found',
        })
      }
    })
  }

  onError(err: Error) {
    console.error(err)
  }

  broadcast(data: MessageDispatch) {
    this.connections.forEach((_, socket) => {
      socket.send(JSON.stringify(data))
    })
  }

  async sendMessage(socket: WebSocket, data: MessageDispatch): Promise<void> {
    return new Promise((resolve, reject) => {
      const socketId = this.connections.get(socket)?._id
      socket.send(JSON.stringify({
        ...data,
        extra: {
          _id: nanoid(),
          socketId,
          timestamp: Date.now(),
        },
      }), err => err ? reject(err) : resolve(undefined))
    })
  }
}
