2nd# System Architecture for AutoClose Prototype

This document outlines the high-level architecture of the midstream Monthly Measurement Close ("AutoClose") prototype, following the MACH Alliance principles.

## 1. MACH Principles
- **Microservices**: Small, single-purpose services for ingestion, monitoring, allocation, and close orchestration.
- **API-first**: All services expose RESTful or gRPC APIs with OpenAPI specifications.
- **Cloud-native**: Containerized services running on Kubernetes (e.g., AWS EKS) with managed infrastructure.
- **Headless**: Decoupled UI; front-end (web dashboard) consumes headless APIs.

## 2. Component Diagram

```mermaid
flowchart LR
  subgraph Event Layer
    Kafka[(Kafka / Kinesis)]
  end

  subgraph Connectors
    C1[Measurement Connector]
    C2[ERP Connector]
    C3[SCADA Connector]
    C4[VolumeMgmt Connector]
    C5[FloCal Connector]
  end

  subgraph Ingestion Service
    Ingest[Data Ingestion Microservice]
  end

  subgraph Processing Services
    Monitor[Meter Monitoring Service]
    Alloc[Allocation Service]
    CloseOrch[Close Orchestration Service]
  end

  subgraph Datastores
    TSDB[(Time-Series DB)]
    SQLDB[(Relational DB)]
    ObjectStore[(S3 / Blob)]
  end

  subgraph API & UI
    API[API Gateway]
    UI[Web Dashboard]
  end

  %% Data flows
  C1 -->|raw events| Kafka
  C2 -->|batch/API| Ingest
  C3 -->|raw events| Kafka
  C4 -->|batch/API| Ingest
  C5 -->|batch/API| Ingest

  Kafka --> Ingest
  Ingest -->|validated streams| Kafka
  Ingest --> TSDB
  Kafka --> Monitor
  Monitor -->|alerts| Kafka
  Kafka --> Alloc
  Alloc --> SQLDB

  Monitor -- Issue Tickets --> TicketAPI[(JIRA / Power Platform)]
  CloseOrch --> SQLDB
  CloseOrch --> TSDB
  CloseOrch --> ObjectStore

  API --> CloseOrch
  API --> Alloc
  API --> Monitor
  UI --> API
```

## 3. Tech Stack

| Layer               | Technology Options                                         |
|---------------------|-------------------------------------------------------------|
| Container Platform  | Docker, Kubernetes (AWS EKS / GKE / AKS)                     |
| Service Mesh & API  | Istio / Linkerd; Kong / AWS API Gateway                     |
| Messaging           | Apache Kafka or AWS Kinesis                                 |
| Compute             | Node.js (TypeScript) or Python (FastAPI) microservices       |
| Databases           | InfluxDB / TimescaleDB for time-series; PostgreSQL for relational |
| Storage             | AWS S3 (or MinIO) for reports & bulk data                   |
| CI/CD               | GitHub Actions / GitLab CI; Helm charts & Argo CD           |
| Monitoring & Logs   | Prometheus, Grafana, ELK stack                              |
| Security            | OAuth2 / OpenID Connect; TLS everywhere; Vault for secrets   |

## 4. Next Steps
1. Configure CI/CD pipelines (GitHub Actions + Argo CD) and container registry.
2. Scaffold microservices repo structure and OpenAPI specs.
3. Provision Kubernetes cluster and message bus.
4. Begin implementing Connector Microservice scaffold.
