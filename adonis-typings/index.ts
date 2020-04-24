/*
 * adonis-fcm
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module 'ioc:Adonis/Addons/FCM' {
  import { IMessageOptions, IResponseBody, ISenderOptions, Message } from 'node-gcm'
  import { IRecipient, ISenderSendOptions } from 'node-gcm'

  export type FCMMessage = IMessageOptions | Message

  export type FCMConfig = {
    apiKey: string;
    requestOptions?: ISenderOptions;
  }

  export interface FakeFCMContract {
    /**
     * Returns the last sent message.
     */
    recent(): object | undefined;

    /**
     * Returns the last sent message and removes it from
     * the array as well
     */
    pullRecent(): object | undefined;

    /**
     * Returns a copy of all the messages
     */
    all(): object[];

    /**
     * Clear all stored messages
     */
    clear(): void;

    send(message: FCMMessage): Promise<FCMMessage>;
    sendNoRetry(message: FCMMessage): Promise<FCMMessage>;
  }

  export interface FCMContract {
    message(options?: FCMMessage): Message;
    fake(): void;
    restore(): void;

    send(
      message: FCMMessage,
      registrationIds: string | string[] | IRecipient
    ): Promise<IResponseBody>;

    send(
      message: FCMMessage,
      registrationIds: string | string[] | IRecipient,
      retries: number
    ): Promise<IResponseBody>;

    send(
      message: FCMMessage,
      registrationIds: string | string[] | IRecipient,
      options: ISenderSendOptions
    ): Promise<IResponseBody>;

    sendNoRetry(
      message: FCMMessage,
      registrationIds: string | string[] | IRecipient
    ): Promise<IResponseBody>;
  }

  const FCM: FCMContract
  export default FCM
}
