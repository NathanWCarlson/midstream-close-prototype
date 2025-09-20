#!/bin/bash
set -e
SERVICES=(ingestion monitor allocation close-orch ticket)
KIND_CLUSTER="autoclose-demo"

# Build Docker images
for SVC in "${SERVICES[@]}"; do
  echo "Building $SVC..."
  docker build -t autoclose-$SVC:latest ../services/$SVC
  echo "Loading $SVC image into kind..."
  kind load docker-image autoclose-$SVC:latest --name $KIND_CLUSTER
  echo "---"
done

echo "All services built and loaded into $KIND_CLUSTER!"

echo "\nIf needed, set registry to '' and imagePullPolicy to IfNotPresent in your Helm values and deployments."
