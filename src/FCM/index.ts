/*
 * adonis-fcm
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FCMConfig, FCMContract, FCMMessage } from 'ioc:Adonis/Addons/FCM'
import { IResponseBody, Message, Sender } from 'node-gcm'
import FakeFCM from './Fake'

/**
 * FCM class is used to grab an instance of sender
 *
 * @class FCM
 * @constructor
 */
export default class FCM implements FCMContract {
  protected $fake: FakeFCM | null = null
  protected $sender: Sender

  constructor (protected $config: FCMConfig) {
    this.$sender = new Sender(
      this.$config.apiKey,
      this.$config.requestOptions
    )

    return new Proxy(this, proxyHandler)
  }

  public message (options: FCMMessage): Message {
    return (options instanceof Message) ? options : new Message(options)
  }

  public fake (): void {
    this.$fake = new FakeFCM()
  }

  public restore (): void {
    this.$fake = null
  }

  public send (message: FCMMessage, recipient, options?) {
    return new Promise<IResponseBody>((resolve, reject) => {
      let callback: any = function (err, response) {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      }
      if (!options || typeof options === 'function') {
        options = callback
        callback = null
      }
      this.$sender.send(this.message(message), recipient, options, callback)
    })
  }

  public sendNoRetry (message: FCMMessage, recipient) {
    return new Promise<IResponseBody>((resolve, reject) => {
      this.$sender.sendNoRetry(this.message(message), recipient, function (err, response) {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      })
    })
  }
}

const proxyHandler = {
  get (target, name) {
    if (typeof name === 'symbol' || name === 'inspect') {
      return target[name]
    }

    if (target.$fake && name in target.$fake) {
      return typeof target.$fake[name] === 'function'
        ? target.$fake[name].bind(target.$fake)
        : target.$fake[name]
    }

    return target[name]
  },
}
