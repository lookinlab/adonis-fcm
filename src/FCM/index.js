'use strict'

/*
 * adonis-fcm
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const { Message, Sender } = require('node-gcm')
const proxyMethods = ['send', 'sendNoRetry']

/**
 * FCM class is used to grab an instance of sender
 *
 * @namespace Adonis/Addons/FCM
 * @alias FCM
 *
 * @class FCM
 * @constructor
 */
class FCM {
  constructor (Config) {
    this.Config = Config

    this._config = this.Config.get('fcm')
    this._fake = null
    this._sender = new Sender(
      this._config.apiKey,
      this._config.requestOptions
    )

    return new Proxy(this, proxyHandler)
  }

  /**
   * Get/Create message
   *
   * @param {Object|Message} options
   * @return {Message}
   */
  message (options) {
    return (options instanceof Message) ? options : new Message(options)
  }

  /**
   * Setup a faker object, which will be used over
   * using the actual gcm methods
   *
   * @method fake
   *
   * @return {void}
   */
  fake () {
    this._fake = new (require('./Fake'))()
  }

  /**
   * Restore faker object
   *
   * @method restore
   *
   * @return {void}
   */
  restore () {
    this._fake = null
  }
}

const proxyHandler = {
  get (target, name) {
    /* istanbul ignore next */
    if (typeof name === 'symbol' || name === 'inspect') {
      return target[name]
    }

    if (target._fake && name in target._fake) {
      return typeof target._fake[name] === 'function'
        ? target._fake[name].bind(target._fake)
        : target._fake[name]
    }

    return target[name]
  }
}

proxyMethods.forEach((method) => {
  FCM.prototype[method] = function (message, ...args) {
    /* istanbul ignore next */
    return new Promise((resolve, reject) => {
      this._sender[method](this.message(message), ...args, function (err, response) {
        if (err) reject(err)
        else resolve(response)
      })
    })
  }
})

module.exports = FCM
