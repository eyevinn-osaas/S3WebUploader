import * as AWS from 'aws-sdk'
import { IAccount } from './model'
import { MessageBus } from './message-bus'
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class ElectronAWSService {
  constructor(private messageBus: MessageBus) {
    this.messageBus.on('AWS-InitAccount', (event: string, arg: IAccount) => {
      this.testAccount(arg).then(success => {
        if (success) {
          this.messageBus.send('AWS-AccountInitialized', arg)
        }
      })
    })
    this.messageBus.on('AWS-TestAccount', (event: string, arg: IAccount) => {
      this.testAccount(arg).then(success => {
        if (success) {
          this.messageBus.send('AWS-CredentialFound', arg)
        } else {
          this.messageBus.send('AWS-CredentialNotFound', arg)
        }
      })
    })
  }

  private testAccount(account: IAccount): Promise<boolean> {
    let s3: AWS.S3
    if (account.initialBucket) {
      s3 = new AWS.S3({
        endpoint: account.url,
        s3BucketEndpoint: true,
        credentials: new AWS.Credentials(account.id, account.secret),
      })
    } else if (account.url) {
      s3 = new AWS.S3({
        endpoint: account.url,
        credentials: new AWS.Credentials(account.id, account.secret),
      })
    } else {
      s3 = new AWS.S3({
        endpoint: account.url,
        credentials: new AWS.Credentials(account.id, account.secret),
      })
    }
    return new Promise<boolean>((resolve, reject) => {
      if (account.initialBucket) {
        s3.listObjects(
          {
            Bucket: account.initialBucket,
          },
          (err, data) => {
            if (err) {
              resolve(false)
            } else {
              resolve(true)
            }
          },
        )
      } else {
        s3.listBuckets((err, data) => {
          if (err) {
            resolve(false)
          } else {
            resolve(true)
          }
        })
      }
    })
  }
}
