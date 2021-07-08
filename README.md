# Adonis FCM (Firebase Cloud Messaging)

[![npm-image]][npm-url] [![license-image]][license-url] [![typescript-image]][typescript-url]

This wrapper for send messages to Firebase Cloud Messaging with help [node-gcm](https://github.com/ToothlessGear/node-gcm)
> Works with AdonisJS v5

Docs [**for AdonisJS v4**](https://github.com/lookinlab/adonis-fcm/tree/v0)

## Installation

Make sure to install it using `npm` or `yarn`.

```bash
# npm
npm i adonis-fcm
node ace invoke adonis-fcm

# yarn
yarn add adonis-fcm
node ace invoke adonis-fcm
```

## How to use

### Step 1: Get API key

You need add your app and to receive API key into [Firebase Console](https://console.firebase.google.com/)

### Step 2: Initialization

- Make sure to register the provider inside `.adonisrc.json` file.

```json
"providers": [
  "...other packages",
  "adonis-fcm"
]
```

- Add a variables to `.env` file of project.
```txt
...
FCM_API_KEY=YOUR_API_KEY
```

- Set options in `config/fcm.ts`.

```js
import Env from '@ioc:Adonis/Core/Env'
import { FCMConfig } from '@ioc:Adonis/Addons/FCM'

const fcmConfig: FCMConfig = {
  apiKey: Env.get('FCM_API_KEY'),
  requestOptions: {
    // proxy: 'http://127.0.0.1'
    // timeout: 5000
  }
}
export default fcmConfig
```

### Step 3: Use service into controllers/routes/listeners

Example:

```js
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Notification from 'App/Models/Notification'
import Event from '@ioc:Adonis/Core/Event'

export default class NotificationController {
  // ...
  async store({ request }: HttpContextContract) {
    const { title, text } = request.body()
    const notification = await Notification.create({ title, text })

    Event.emit('notification::created', notification)
    return notification
  }
}
```

Add an event to `start/events.ts` file.

```js
import Event from '@ioc:Adonis/Core/Event'
Event.on('notification::created', 'Notification.created');
```

Create a listener:

```bash
node ace make:listener Notification
```

Add a listener to `app/Listeners/Notification.ts` file.

```js
import { EventsList } from '@ioc:Adonis/Core/Event'
import FCM from '@ioc:Adonis/Addons/FCM'

export default class NotificationListener {
  public async created(notification: EventsList['notification::created']) {
    const { title, text } = notification.toJSON();
    
    const recipients = { condition: "'notifications' in topics" }; // or { registrationTokens: [...] }
    const response = await FCM.send({ notification: { title, body: text }}, recipients);
  }
}
```

## Methods

### FCM.message(params) - return a Message instance
- params:  {Object} - [Additional Message Options](https://github.com/ToothlessGear/node-gcm#additional-message-options) and [Notification Payload](https://github.com/ToothlessGear/node-gcm#notification-payload-option-table)

### FCM.send(message, options, numberOfTimes) - return a Promise
- message: {Object|Message}
- options: {Object} - [Docs](https://github.com/ToothlessGear/node-gcm#recipients)

### FCM.sendNoRetry(message, options) - return a Promise
- message: {Object|Message}
- options: {Object} - [Docs](https://github.com/ToothlessGear/node-gcm#recipients)
 
## Answers:

### Q: Where get a registration tokens?
The registration token is sent by the user when he uses your application. You need save token to use it later

### Q: I need to remove all "bad" token from my database, how do I do that? 
For example like this:

```js
import { EventsList } from '@ioc:Adonis/Core/Event'
import FCM from '@ioc:Adonis/Addons/FCM'
import Device from 'App/Models/Device'

export default class NotificationListener {
  public async created(notification: EventsList['notification::created']) {
    const { title, text } = notification.toJSON();

    const devices = await Device.all();
    const registrationTokens = devices.toJSON().map(device => device.token);
    
    const recipients = { registrationTokens };
    const response = await FCM.send({ notification: { title, body: text }}, recipients);
    
    const badTokens = registrationTokens.filter((token, i) => response[i].error !== null);
    await Device.query().whereIn('token', badTokens).delete();
  }
}
```

[npm-image]: https://img.shields.io/npm/v/adonis-fcm?logo=npm&style=for-the-badge
[npm-url]: https://www.npmjs.com/package/adonis-fcm

[license-image]: https://img.shields.io/npm/l/adonis-fcm?style=for-the-badge&color=blueviolet
[license-url]: https://github.com/lookinlab/adonis-fcm/blob/develop/LICENSE.md

[typescript-image]: https://img.shields.io/npm/types/adonis-fcm?color=294E80&label=%20&logo=typescript&style=for-the-badge
[typescript-url]: https://github.com/lookinlab
