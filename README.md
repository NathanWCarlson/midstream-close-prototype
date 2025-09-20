# AutoClose Prototype

## Local Development & SCADA Ingestion Test

1. Ensure Docker Desktop (or Docker Engine) is running on your machine.
2. In project root, start Kafka:
   ```bash
   docker compose up -d
   ```
3. Ingestion Service:
   ```bash
   cd services/ingestion

## Argo CD GitOps Deployment

1. Install the Argo CD CLI:
   ```bash
   brew install argocd
   ```
2. Log in to Argo CD:
   ```bash
   argocd login <ARGOCD_SERVER> \
     --username <ARGOCD_USER> \
     --password <ARGOCD_PASS> \
     --insecure
   ```
3. Apply the application manifest:
   ```bash
   kubectl apply -f argocd-app.yaml
   ```
4. Sync and verify:
   ```bash
   argocd app sync autoclose-prototype
   argocd app wait autoclose-prototype --health --timeout 300s
   ```
5. Check namespace pods:
   ```bash
   kubectl get pods -n autoclose
   ```

_Note: Helm CLI deployment via `helm upgrade --install` remains available as fallback._

   npm ci
   node index.js
   ```
4. In a new terminal, run the test script:
   ```bash
   cd services/ingestion
   npm install axios kafka-node
   node test_ingest.js
   ```
   You should see the sample SCADA data published and consumed from Kafka.
