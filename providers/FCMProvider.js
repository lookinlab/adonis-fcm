'use strict'

/*
 * adonis-fcm
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const { ServiceProvider } = require('@adonisjs/fold')

class FCMProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this.app.singleton('Adonis/Addons/FCM', () => {
      const Config = this.app.use('Adonis/Src/Config')
      return new (require('../src/FCM'))(Config)
    })
    this.app.alias('Adonis/Addons/FCM', 'FCM')
  }
}

module.exports = FCMProvider
