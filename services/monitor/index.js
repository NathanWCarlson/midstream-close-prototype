const express = require('express');
const bodyParser = require('body-parser');
const { KafkaClient, Consumer } = require('kafka-node');

// Configuration
const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';
const SCADA_TOPIC = process.env.SCADA_TOPIC || 'scada-data';
const THRESHOLDS = {
  pressure: { min: 100, max: 500 },
  flowRate: { min: 10, max: 200 }
};

// Initialize Express
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3001;

// Health endpoint
app.get('/health', (req, res) => res.send('Monitor Service Healthy'));

// Kafka consumer setup
targetClient = new KafkaClient({ kafkaHost: KAFKA_BROKER });
const consumer = new Consumer(
  targetClient,
  [{ topic: SCADA_TOPIC, partition: 0 }],
  { autoCommit: true }
);

consumer.on('message', (message) => {
  try {
    const data = JSON.parse(message.value);
    console.log('Received SCADA data:', data);

    // Simple threshold checks
    let alerts = [];
    if (data.pressure < THRESHOLDS.pressure.min || data.pressure > THRESHOLDS.pressure.max) {
      alerts.push(`Pressure out of bounds: ${data.pressure}`);
    }
    if (data.flowRate < THRESHOLDS.flowRate.min || data.flowRate > THRESHOLDS.flowRate.max) {
      alerts.push(`FlowRate out of bounds: ${data.flowRate}`);
    }

    if (alerts.length) {
      alerts.forEach(alert => console.warn('[ALERT]', alert));
      // TODO: enqueue maintenance ticket via API or event
    }

  } catch (err) {
    console.error('Error processing message:', err);
  }
});

consumer.on('error', (err) => console.error('Kafka Consumer error:', err));

// Start Express server
app.listen(port, () => console.log(`Monitor Service listening on port ${port}`));
