# Adonis FCM (Firebase Cloud Messaging)

> Works with AdonisJS v4.*

This wrapper for send messages to Firebase Cloud Messaging with help [node-gcm](https://github.com/ToothlessGear/node-gcm)

## Installation

Make sure to install it using [`adonis-cli`](https://github.com/adonisjs/adonis-cli), `npm` or `yarn`.

```bash
# adonis
adonis install adonis-fcm@0.1.1

# npm
npm i adonis-fcm@0.1.1

# yarn
yarn add adonis-fcm@0.1.1
```

## How to use

### Step 1: Get API key
You need add your app and to receive API key into [Firebase Console](https://console.firebase.google.com/)

### Step 2: Initialization
- Make sure to register the provider inside `start/app.js` file.
```js
const providers = [
  'adonis-fcm/providers/FCMProvider'
]
```

- Add a variables to `.env` file of project.
```txt
...
FCM_API_KEY=YOUR_API_KEY
```

- Set options in `config/fcm.js`.
```js
const Env = use('Env')

module.exports = {
  ...
  apiKey: Env.getOrFail('FCM_API_KEY'),
  requestOptions: {
    // proxy: 'http://127.0.0.1'
    // timeout: 5000
  }
}
```

### Step 3: Use service into controllers/routes/listeners
Example:
```js
'use strict'

const Notification = use('App/Models/Notification')
const Event = use('Event')

class NotificationController {
  ...
  async store({ request }) {
    const { title, text } = request.post()
    const notification = await Notification.create({ title, text })

    Event.emit('notification::created', notification)
    return notification
  }
}
```

Add an event to `start/events.js` file.
```js
'use strict'

const Event = use('Event');
Event.on('notification::created', 'Notification.created');
```

Create a listener:

```bash
adonis make:listener Notification
```

Add a listener to `app/Listeners/Notification.js` file.

```js
'use strict';

const FCM = use('FCM');
const Notification = exports = module.exports = {};

Notification.created = async (instance) => {
  const { title, text } = instance.toJSON();

  const recipients = { condition: "'notifications' in topics" }; // or { registrationTokens: [...] }
  const response = await FCM.send({ notification: { title, body: text }}, recipients);
};
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
'use strict';

const FCM = use('FCM');
const Device = use('App/Models/Device')

const Notification = exports = module.exports = {};

Notification.created = async (instance) => {
  const { title, text } = instance.toJSON();

  const devices = await Device.all();
  const registrationTokens = devices.toJSON().map(device => device.token);
  
  const recipients = { registrationTokens };
  const response = await FCM.send({ notification: { title, body: text }}, recipients);
  
  const badTokens = registrationTokens.filter((token, i) => response[i].error !== null);
  await Device.query().whereIn('token', badTokens).delete();
};
```
