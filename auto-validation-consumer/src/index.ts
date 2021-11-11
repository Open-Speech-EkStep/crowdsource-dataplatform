import { Kafka } from 'kafkajs'
import validator from './validations/AutoValidation'
import dbOperations from './dbOperations/dbOperations'
import { boolean } from 'yargs';
require('dotenv').config();

const clientId = "crowdsource-app"

const brokers = [process.env.BROKER_URL!]

const kafkaTopic = process.env.TOPIC!;

const kafka = new Kafka({ clientId, brokers })

const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: kafkaTopic, fromBeginning: false })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
      console.log(`- ${prefix} ${message.key}#${message.value}`)

      const contributionId = Number(message.value);

      const info = await dbOperations.getContributionInfo(contributionId);

      let allowValidation : boolean = false;

      if (info != null) {
        console.log(info);

        allowValidation = validator[info.type](info.language!, info.modeloutput!, info.userinput!);

      }
      
      console.log(allowValidation);
      await dbOperations.allowDisallowValidationOnContribution(contributionId, !allowValidation);
    },
  })

}

run().catch(e => console.error(`[example/consumer] ${e.message}`, e))