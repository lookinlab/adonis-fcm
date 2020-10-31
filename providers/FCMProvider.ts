/*
 * adonis-fcm
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import FCM from '../src/FCM'

export default class FCMProvider {
  public static needsApplication = true
  constructor (protected app: ApplicationContract) {}

  public register (): void {
    this.app.container.singleton('Adonis/Addons/FCM', () => {
      const config = this.app.container.use('Adonis/Core/Config').get('fcm', {})
      return new FCM(config)
    })
  }
}
