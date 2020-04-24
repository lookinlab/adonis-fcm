/*
 * adonis-fcm
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
import FCM from '../src/FCM'
import FakeFCM from '../src/FCM/Fake'
import { Message } from 'node-gcm'

const config = {
  apiKey: '123123123',
  requestOptions: {},
}

test.group('FCM', () => {
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

    assert.instanceOf(fcm.getFake(), FakeFCM)
  })
})
