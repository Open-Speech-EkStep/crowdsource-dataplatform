import { Kafka } from 'kafkajs'
require('dotenv').config();
// the client ID lets kafka know who's producing the messages
const clientId = "crowdsource-app"
// we can define the list of brokers in the cluster
const brokers = [ process.env.BROKER_URL! ]
// this is the topic to which we want to write messages
const topic = process.env.TOPIC!;
console.log(brokers);
console.log(topic)
const kafka = new Kafka({ clientId, brokers })

const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: true })
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
        console.log(`- ${prefix} ${message.key}#${message.value}`)
        console.log({
            value: message.value,
          })
      },
    })

  }

  run().catch(e => console.error(`[example/consumer] ${e.message}`, e))