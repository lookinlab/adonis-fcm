/*
 * adonis-fcm
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FakeFCMContract } from 'ioc:Adonis/Addons/FCM'

/**
 * Fake FCM is used to send fake messages
 *
 * @class FakeFCM
 * @constructor
 */
export default class FakeFCM implements FakeFCMContract {
  protected $messages: object[] = []

  public recent () {
    return this.$messages[this.$messages.length - 1]
  }

  public pullRecent () {
    return this.$messages.pop()
  }

  public all (): object[] {
    return JSON.parse(JSON.stringify(this.$messages))
  }

  public clear () {
    this.$messages.length = 0
  }

  public async send (message) {
    this.$messages.push(message)
    return message
  }

  public async sendNoRetry (message) {
    this.$messages.push(message)
    return message
  }
}
