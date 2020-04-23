/*
 * adonis-fcm
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { IocContract } from '@adonisjs/fold'
import FCM from '../src/FCM'

export default class FCMProvider {
  constructor (protected container: IocContract) {
  }

  public register (): void {
    this.container.singleton('Adonis/Addons/FCM', () => {
      const config = this.container.use('Adonis/Core/Config').get('fcm', {})
      return new FCM(config)
    })
    // this.container.alias('Adonis/Addons/FCM', 'FCM')
  }
}
