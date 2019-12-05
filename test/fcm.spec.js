'use strict'

/*
 * adonis-fcm
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const test = require('japa')
const { Config } = require('@adonisjs/sink')

const FCM = require('../src/FCM')
const { Message } = require('node-gcm')

let config
test.group('FCM', (group) => {
  group.before(() => {
    config = new Config()
    config.set('fcm.apiKey', '123123123')
    config.set('fcm.requestOptions', {})
  })

  test('Create a message from object', (assert) => {
    const fcm = new FCM(config)
    const message = fcm.message()

    assert.instanceOf(message, Message)
  })

  test('Get a message from message method', (assert) => {
    const fcm = new FCM(config)
    const message1 = fcm.message()
    const message2 = fcm.message(message1)

    assert.strictEqual(message1, message2)
  })

  test('Proxy handler', (assert) => {
    const fcm = new FCM(config)
    fcm.fake()

    assert.isFunction(fcm.recent)
    assert.isFunction(fcm.clear)
  })
})
