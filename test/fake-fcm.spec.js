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

const FakeFCM = require('../src/FCM/Fake')
const FCM = require('../src/FCM')

let config
test.group('Fake FCM', (group) => {
  group.before(() => {
    config = new Config()
    config.set('fcm.apiKey', '123123123')
    config.set('fcm.requestOptions', {})
  })

  test('Fake FCM send all a messages to memory', async (assert) => {
    const fcm = new FCM(config)
    fcm.fake()

    await fcm.send({ notification: { title: 'Test message 1' } })
    await fcm.send({ notification: { title: 'Test message 2' } })

    assert.lengthOf(fcm._messages, 2)
    fcm.clear()
  })

  test('Get a message in response', async (assert) => {
    const fcm = new FCM(config)
    fcm.fake()

    const message = { notification: { title: 'Test message 1' } }
    const response = await fcm.send(message)

    assert.deepEqual(response, message)
    fcm.clear()
  })

  test('Get recent a message', async (assert) => {
    const fcm = new FCM(config)
    fcm.fake()

    const message = { notification: { title: 'Test message 1' } }
    await fcm.send(message)

    assert.deepEqual(message, fcm.recent())
    fcm.clear()
  })

  test('Get recent a message and remove from array messages', async (assert) => {
    const fcm = new FCM(config)
    fcm.fake()

    await fcm.send({ notification: { title: 'Test message 1' } })
    const response = await fcm.send({ notification: { title: 'Test message 2' } })

    assert.deepEqual(response, fcm.pullRecent())
    assert.lengthOf(fcm._messages, 1)
    fcm.clear()
  })

  test('Get a copy all messages', async (assert) => {
    const fcm = new FCM(config)
    fcm.fake()

    await fcm.send({ notification: { title: 'Test message 1' } })
    await fcm.send({ notification: { title: 'Test message 2' } })

    const messages = fcm.all()
    assert.lengthOf(messages, 2)

    messages[0].notification.title = 'Overwrite title'
    assert.equal(fcm._messages[0].notification.title, 'Test message 1')

    fcm.clear()
  })

  test('Restore fake fcm', async (assert) => {
    const fcm = new FCM(config)

    fcm.fake()
    assert.instanceOf(fcm._fake, FakeFCM)

    fcm.restore()
    assert.isNull(fcm._fake)
  })
})
