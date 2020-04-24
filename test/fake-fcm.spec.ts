/*
 * adonis-fcm
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
import FakeFCM from '../src/FCM/Fake'
import { FCMMessage } from 'ioc:Adonis/Addons/FCM'
import FCM from '../src/FCM'

test.group('Fake FCM', () => {
  test('Fake FCM send all a messages to memory', async (assert) => {
    const fcm = new FakeFCM()

    await fcm.send({ notification: { title: 'Test message 1' } })
    await fcm.send({ notification: { title: 'Test message 2' } })

    assert.lengthOf(fcm.all(), 2)
    fcm.clear()
  })

  test('Get a message in response', async (assert) => {
    const fcm = new FakeFCM()

    const message = { notification: { title: 'Test message 1' } }
    const response = await fcm.send(message)

    assert.deepStrictEqual(response, message)
    fcm.clear()
  })

  test('Get recent a message', async (assert) => {
    const fcm = new FakeFCM()

    const message = { notification: { title: 'Test message 1' } }
    await fcm.send(message)

    assert.deepStrictEqual(message, fcm.recent())
    fcm.clear()
  })

  test('Get recent a message and remove from array messages', async (assert) => {
    const fcm = new FakeFCM()

    await fcm.send({ notification: { title: 'Test message 1' } })
    const response = await fcm.send({ notification: { title: 'Test message 2' } })

    assert.deepStrictEqual(response, fcm.pullRecent())
    assert.lengthOf(fcm.all(), 1)
    fcm.clear()
  })

  test('Get a copy all messages', async (assert) => {
    const fcm = new FakeFCM()

    await fcm.send({ notification: { title: 'Test message 1', icon: 'base' } })
    await fcm.send({ notification: { title: 'Test message 2', icon: 'base' } })

    const messages1 = fcm.all()
    assert.lengthOf(messages1, 2)

    const first: FCMMessage = messages1[0]
    first.notification!.title = 'Overwrite title'

    const messages2 = fcm.all()
    const second: FCMMessage = messages2[0]
    assert.strictEqual(second.notification!.title, 'Test message 1')

    fcm.clear()
  })

  test('Restore fake fcm', async (assert) => {
    const fcm = new FCM({ apiKey: '12223333', requestOptions: {} })

    fcm.fake()
    assert.instanceOf(fcm.getFake(), FakeFCM)

    fcm.restore()
    assert.strictEqual(fcm.getFake(), null)
  })
})
