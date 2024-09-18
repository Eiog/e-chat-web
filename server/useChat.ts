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
  _id: string
  name: string
}
export type MessageType = 'text' | 'video' | 'audio' | 'image'
export type MessageStatus = 'success' | 'error' | 'pending'
type MessageMethod = 'connect' | 'close' | 'error' | 'message' | 'message-status'
// 收到
export interface MessageReceive {
  _id: string
  type: MessageType
  status: MessageStatus
  subType: 'receive' | 'dispatch'
  _targetId: string
  target?: User
  content: string
  createAt: Date
}
// 返回
export interface MessageDispatch {
  method: MessageMethod
  status: MessageStatus
  payload: {
    messageType: MessageType
    subType: 'receive' | 'dispatch'
    content: string
  }
  _id: string
  _fromId: string
  from?: User
  _targetId: string
  target?: User
  createAt: Date
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
    const _fromId = headers['sec-websocket-protocol']?.replace('_id-', '')
    if (!_fromId) {
      socket.close()
      return
    }
    this.connections.set(socket, { _id: _fromId, headers })
    this.broadcast({
      method: 'connect',
      status: 'success',
      payload: {
        messageType: 'text',
        subType: 'receive',
        content: `${_fromId}-connected`,
      },
      _id: _fromId,
      _fromId,
      _targetId: _fromId,
      createAt: new Date(),
    })
    socket.on('close', () => {
      this.connections.delete(socket)
      this.broadcast({
        method: 'close',
        status: 'success',
        payload: {
          messageType: 'text',
          subType: 'receive',
          content: `${_fromId}-connected`,
        },
        _id: _fromId,
        _fromId,
        _targetId: _fromId,
        createAt: new Date(),
      })
    })
    socket.on('message', (data) => {
      const { _id, type, _targetId, content, createAt } = JSON.parse(data.toString()) as MessageReceive
      const targetMap = Array.from(this.connections).find(([_, { _id }]) => _id === _targetId)
      if (targetMap) {
        const targetSocket = targetMap[0]
        this.sendMessage(targetSocket, {
          method: 'message',
          status: 'success',
          payload: {
            messageType: type,
            subType: 'receive',
            content,
          },
          _id,
          _fromId,
          _targetId,
          createAt,
        }).then(() => {
          this.sendMessage(socket, {
            method: 'message-status',
            status: 'success',
            payload: {
              messageType: type,
              subType: 'receive',
              content: 'send ok',
            },
            _id,
            _fromId,
            _targetId,
            createAt,
          })
        }).catch((err) => {
          this.sendMessage(socket, {
            method: 'message-status',
            status: 'error',
            payload: {
              messageType: type,
              subType: 'receive',
              content: `socket send error${JSON.stringify(err)}`,
            },
            _id,
            _fromId,
            _targetId,
            createAt,
          })
        })
      }
      else {
        this.sendMessage(socket, {
          method: 'message-status',
          status: 'error',
          payload: {
            messageType: type,
            subType: 'receive',
            content: 'target not found',
          },
          _id,
          _fromId,
          _targetId,
          createAt,
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
