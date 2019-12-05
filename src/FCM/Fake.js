'use strict'

/*
 * adonis-fcm
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const proxyMethods = ['send', 'sendNoRetry']

/**
 * Fake FCM is used to send fake messages
 *
 * @class FakeFCM
 * @constructor
 */
class FakeFCM {
  constructor () {
    this._messages = []
  }

  /**
   * Returns the last sent message.
   *
   * @method recent
   *
   * @return {Object}
   */
  recent () {
    return this._messages[this._messages.length - 1]
  }

  /**
   * Returns the last sent message and removes it from
   * the array as well
   *
   * @method pullRecent
   *
   * @return {Object}
   */
  pullRecent () {
    return this._messages.pop()
  }

  /**
   * Returns a copy of all the messages
   *
   * @method all
   *
   * @return {Array}
   */
  all () {
    return JSON.parse(JSON.stringify(this._messages))
  }

  /**
   * Clear all stored messages
   *
   * @method clear
   *
   * @return {void}
   */
  clear () {
    this._messages.length = 0
  }
}

proxyMethods.forEach((method) => {
  FakeFCM.prototype[method] = function (message) {
    return new Promise(resolve => {
      this._messages.push(message)
      resolve(message)
    })
  }
})

module.exports = FakeFCM
