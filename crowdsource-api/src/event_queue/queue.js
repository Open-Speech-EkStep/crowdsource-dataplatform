// import the `Kafka` instance from the kafkajs library
const { Kafka } = require("kafkajs")

// the client ID lets kafka know who's producing the messages
const clientId = "crowdsource-app"
// we can define the list of brokers in the cluster
const brokers = [process.env.BROKER_URL]
// this is the topic to which we want to write messages
const topic = process.env.TOPIC;

// initialize a new kafka client and initialize a producer from it
const kafka = new Kafka({ clientId, brokers })
const producer = kafka.producer()

// we define an async function that writes a new message each second
const produceEvent = async (message) => {
	await producer.connect()

	try {
		// send a message to the configured topic with
		await producer.send({
			topic,
			messages: [{
				value: message
			}],
		})
	} catch (err) {
		console.error("could not write message " + err)
	}
	await producer.disconnect();
}

module.exports = {produceEvent}