const axios = require('axios');
const { KafkaClient, Consumer } = require('kafka-node');

const INGEST_URL = process.env.INGEST_URL || 'http://localhost:3000/ingest/scada';
const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';
const SCADA_TOPIC = process.env.SCADA_TOPIC || 'scada-data';

(async () => {
  try {
    // Sample SCADA data payload
    const sample = {
      meterId: 'SCADA123',
      timestamp: new Date().toISOString(),
      pressure: 250.5,
      flowRate: 120.3
    };

    console.log('Publishing sample data to ingestion service...');
    const resp = await axios.post(INGEST_URL, sample);
    console.log('Ingestion response:', resp.data);

    console.log('Consuming from Kafka topic to verify...');
    const client = new KafkaClient({ kafkaHost: KAFKA_BROKER });
    const consumer = new Consumer(
      client,
      [{ topic: SCADA_TOPIC, partition: 0 }],
      { autoCommit: true }
    );

    consumer.on('message', (message) => {
      console.log('Received message from Kafka:', message.value);
      process.exit(0);
    });
    consumer.on('error', (err) => {
      console.error('Kafka Consumer error:', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('Test ingestion error:', err.message);
    process.exit(1);
  }
})();
