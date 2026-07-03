import { initializeApp, cert, App } from 'firebase-admin/app'
import { getMessaging, Message } from 'firebase-admin/messaging'
import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'

export class NotificationService {
  private client: App

  constructor() {
    const serviceAccount = JSON.parse(
      readFileSync(
        resolve('./src/common/utils/assem64-firebase-adminsdk-fbsvc-a8b47475e0.json'),
        'utf-8'
      )
    )

    this.client = initializeApp({
      credential: cert(serviceAccount),
    })
  }

  async sendNotification({
    token,
    data,
  }: {
    token: string
    data: Record<string, string>
  }) {
    const message: Message = {
      token,
      data,
    }

    return await getMessaging(this.client).send(message)
  }
    async sendNotifications({
    tokens,
    data,
  }: {
    tokens: string[]
    data: Record<string, string>
  }) {
    await Promise.allSettled(
      tokens.map(token=>{
      return  this.sendNotification({token,data})
      })
    )
  }
}
export const notificationService=new NotificationService()