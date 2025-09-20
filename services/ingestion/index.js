const express = require('express');
const bodyParser = require('body-parser');
const { KafkaClient, Producer } = require('kafka-node');

// Load environment variables
const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';
const SCADA_TOPIC = process.env.SCADA_TOPIC || 'scada-data';
const MEASUREMENT_TOPIC = process.env.MEASUREMENT_TOPIC || 'measurement-data';
const ERP_TOPIC = process.env.ERP_TOPIC || 'erp-data';
const VOLUME_TOPIC = process.env.VOLUME_TOPIC || 'volume-data';
const FLOCAL_TOPIC = process.env.FLOCAL_TOPIC || 'flocal-data';

// Initialize Kafka client and producer
const kafkaClient = new KafkaClient({ kafkaHost: KAFKA_BROKER });
const producer = new Producer(kafkaClient);
let producerReady = false;
producer.on('ready', () => {
  console.log('Kafka Producer is ready');
  producerReady = true;
});
producer.on('error', (err) => {
  console.error('Kafka Producer error:', err);
});

// Express setup
envPort = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());

// Health endpoint
app.get('/health', (req, res) => res.send('Ingestion Service Healthy'));

// Generic helper to publish to Kafka
function publishToKafka(topic, record, res) {
  if (!producerReady) return res.status(503).json({ error: 'Kafka Producer not ready' });
  const payloads = [{ topic, messages: JSON.stringify(record) }];
  producer.send(payloads, (err, data) => {
    if (err) {
      console.error(`Error publishing to Kafka topic ${topic}:`, err);
      return res.status(500).json({ error: 'Failed to publish message' });
    }
    res.json({ status: 'OK', topic, data });
  });
}

// SCADA data ingestion endpoint
app.post('/ingest/scada', (req, res) => publishToKafka(SCADA_TOPIC, req.body, res));

// Other ingestion endpoints
app.post('/ingest/measurement', (req, res) => publishToKafka(MEASUREMENT_TOPIC, req.body, res));
app.post('/ingest/erp', (req, res) => publishToKafka(ERP_TOPIC, req.body, res));
app.post('/ingest/volume', (req, res) => publishToKafka(VOLUME_TOPIC, req.body, res));
app.post('/ingest/flocal', (req, res) => publishToKafka(FLOCAL_TOPIC, req.body, res));

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Ingestion Service listening on port ${port}`));
