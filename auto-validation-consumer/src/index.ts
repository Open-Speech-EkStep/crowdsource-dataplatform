import { Kafka } from 'kafkajs'
import validator from './validations/AutoValidation'
import dbOperations from './dbOperations/dbOperations'
import config from 'config';

require('dotenv').config();

const autoValidationEnabled = config.get('autoValidation') ? config.get('autoValidation') == "enabled" : false;
console.log('autoValidationEnabled', autoValidationEnabled)
console.log('env', config.get('envName'))
if (!autoValidationEnabled) {
  console.log(`Auto validations disabled`);
  process.exit();
}

const clientId = "crowdsource-app"

const brokers = [process.env.BROKER_URL!]

const kafkaTopic = process.env.TOPIC!;

const kafka = new Kafka({ clientId, brokers })

const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
  if (!autoValidationEnabled) {
    console.log(`Auto validations disabled`);
		return;
	}
  console.log(`Node env ${process.env.NODE_ENV}`);
  console.log(`Node env ${process.env.NODE_CONFIG_ENV}`);
  
  await consumer.connect()
  await consumer.subscribe({ topic: kafkaTopic, fromBeginning: false })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
      console.log(`- ${prefix} ${message.key}#${message.value}`)
      try {
        const contributionId = Number(message.value);

        const info = await dbOperations.getContributionInfo(contributionId);

        let allowValidation: boolean = false;

        if (info != null) {
          console.log(info);

          allowValidation = validator[info.type](info.language!, info.modeloutput!, info.userinput!);

        }

        console.log(allowValidation);
        await dbOperations.allowDisallowValidationOnContribution(contributionId, allowValidation);
      }
      catch (error) {
        console.log(`consumer error: ${error}`)
      }
    },
  })

}

run().catch(e => console.error(`[example/consumer] ${e.message}`, e))