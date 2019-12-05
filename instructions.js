'use strict'

/*
 * adonis-fcm
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const path = require('path')

module.exports = async function (cli) {
  try {
    await cli.copy(
      path.join(__dirname, './config/fcm.js'),
      path.join(cli.helpers.configPath(), 'fcm.js')
    )
    cli.command.completed('create', 'config/fcm.js')
  } catch (error) {}
}
