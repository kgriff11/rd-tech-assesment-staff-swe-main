# Development practices questions

Please provide thoughtful responses to the following questions. Your answers should demonstrate your understanding of modern development practices and architectural considerations.

## DevOps Practices

### 1. CI/CD Pipeline Design

**Question:** How do you design CI/CD pipelines for applications like this? What are your must-have checks?

**Your Answer:**

1. Source Control and CI Triggers

I'd begin designing the pipeline to kick in automatically when certain events happen:

A Pull Request or Merge Request is opened.

Code is pushed to main or master.

A tag is created, usually for a release.

2. Continuous Integration (CI) Steps

a) Environment Setup
Make sure the environment is clean and ready:

Backend: Python 3.x, install dependencies with pip install -r requirements.txt or poetry install. Use a virtual environment to isolate dependencies.

Frontend: Node 18+ with npm ci or bun install.

This ensures every run starts from the same base environment.

b) Code Quality Checks
Before running tests, check that the code follows style and quality standards:

Linters: Python (flake8 or pylint), JavaScript/TypeScript (eslint).

Formatters: Python (black), frontend (prettier).

Type checks: Python (mypy, optional) and TypeScript (tsc --noEmit).

These catch errors and inconsistencies before they make it into the main branch.

c) Unit and Integration Tests
Test both the backend and frontend thoroughly:

Backend: pytest with coverage reporting. Also test API endpoints with the Flask test client.

Frontend: vitest or jest for components, hooks, and API services.

d) Security & Vulnerability Scans
Make sure dependencies are safe:

Python: safety or pip-audit.

Node: npm audit or yarn audit.

Scan commits for exposed secrets using GitHub secret scanning or similar tools.

e) Build

Frontend: bundle the React app using Vite or Bun.

Backend: optionally build a Docker image (docker build -t baseball-stats-backend .) to ensure it runs consistently anywhere.

3. Continuous Deployment (CD) Steps

a) Containerization
Use Docker to standardize deployments:

Backend: Python + Flask + SQLite (or another production DB).

Frontend: Node + Vite/Bun.

b) Deployment Environments
Separate pipelines for different stages:

Dev / Staging: Automatically deploy PRs or main branch commits, then run smoke tests.

Production: Usually a manual approval, or automated for tagged releases. Use canary or blue-green deployment to avoid downtime.

c) Post-deployment Checks
After deployment, make sure everything is running:

Hit health endpoints (like /health) to verify the service is live.

Set up logging and monitoring.

4. Must-Have Checks

Some things I always include in the pipeline:

Code quality and style: linting & formatting.

Unit & integration test coverage: backend and frontend.

Type safety: TypeScript and optional Python type checks.

Security audits: dependencies & secret scanning.

Build verification: ensure Docker images or frontend bundles run.

Smoke / health checks: confirm the deployed service responds.

Database migration checks: for evolving schemas (Alembic or Flyway).

### 2. Infrastructure as Code

**Question:** How would you approach infrastructure-as-code for deploying this project in a cloud environment?

**Your Answer:** 1. Choose a Cloud Provider & IaC Tool

Cloud Providers:

AWS, GCP, or Azure.

IaC Tool:

Terraform – provider-agnostic, good for multi-cloud.

2. Define Resources

Frontend (React app)

S3 bucket to host the static build files.

CloudFront CDN for low-latency delivery.

Route53 to map a domain.

Backend (Flask app)

Dockerized Flask container (using Dockerfile).

ECS + Fargate for container orchestration.

RDS / Aurora / PostgreSQL depending on production requirements.

Secrets Manager / Parameter Store for storing environment variables, DB credentials, API keys.

ALB / API Gateway for routing traffic and HTTPS termination.

Networking & Security

VPC with subnets, security groups, and routing tables.

Load balancer with HTTPS.

IAM roles for services to securely access resources.

3. Organize IaC Code

Directory structure example (Terraform):

infrastructure/
├─ main.tf # Provider + general config
├─ variables.tf # All input variables
├─ outputs.tf # Exported outputs like endpoints
├─ frontend.tf # S3, CloudFront, Route53
├─ backend.tf # ECS, ECR, RDS
├─ networking.tf # VPC, subnets, security groups
├─ secrets.tf # Secrets Manager / Parameter Store

Key Terraform patterns:

Use modules for reusability (e.g., a vpc module).

Separate frontend and backend deployments for independent scaling.

Use workspaces or variable files for dev / staging / prod.

4. Deployment Flow

Provision Infrastructure

terraform init → terraform plan → terraform apply

Creates S3 bucket, ECS cluster, database, etc.

Deploy Backend

Build Docker image locally or in CI.

Push image to ECR (AWS).

Update ECS service via IaC (Terraform can trigger container deployment).

Deploy Frontend

Run npm run build → copy build/ to S3 bucket via Terraform aws_s3_bucket_object or CI/CD.

CloudFront invalidation to refresh cache.

Run Health Checks

Terraform outputs the URLs; hit /health endpoint to verify backend.

Frontend should load the React app.

5. Best Practices

State Management:
Use remote state storage (e.g., S3 + DynamoDB locking) to prevent conflicts between team members.

Environment Separation:
Keep dev/staging/prod isolated with workspaces or different state files.

Secrets Management:
Never hardcode secrets. Use AWS Secrets Manager, Parameter Store, or Vault.

CI/CD Integration:
Terraform + GitHub Actions pipeline can automate provisioning on merges to main.
Frontend & backend builds can be deployed automatically once infrastructure is ready.

Monitoring & Logging:

CloudWatch logs for backend containers.

S3 + CloudFront metrics for frontend.

Alerts on failed health checks.

### 3. Monitoring and Alerting

**Question:** What strategies do you recommend for monitoring and alerting in production?

**Your Answer:** 1. Infrastructure & System Monitoring

Monitor the underlying servers, containers, and cloud services:

Metrics to collect:

CPU, memory, disk, network usage for backend servers or containers.

Container-specific metrics if using Docker/ECS (CPU %, memory %, running tasks).

Database metrics: connection count, query latency, cache hit/miss rates.

Tools:

Cloud-native: AWS CloudWatch, GCP Stackdriver, Azure Monitor.

Open-source / multi-cloud: Prometheus + Grafana for metrics collection and visualization.

Alerting:

High CPU/memory usage over a threshold.

Database connection pool exhaustion.

Container crashes or restarts.

2. Application Monitoring

Focus on the Flask backend and React frontend:

Backend (Flask)

Metrics to track:

HTTP request counts and response times (per endpoint).

Error rates (5xx vs 2xx).

Throughput (requests/sec).

Tools:

Prometheus + Flask exporter: collect metrics like request duration, response codes.

APM tools: Datadog, New Relic, or Elastic APM to trace request flows, database queries.

Alerting:

Spike in error rates (>5% 5xx in 5 min window).

Slow endpoints (>500 ms or configurable threshold).

Frontend (React)

Metrics to track:

Page load times (TTFB, full load).

JavaScript errors or failed API requests.

User interaction metrics (optional: for UX analysis).

Tools:

Sentry or Bugsnag for real-time error reporting.

Google Analytics / RUM (Real User Monitoring) for frontend performance.

Alerting:

Repeated frontend errors (JS exceptions) indicating broken functionality.

Backend API failures observed from frontend.

3. Logging

Centralized logging is crucial for diagnosing issues:

Backend Logs:

Use structured logging (JSON) with request IDs to trace user requests.

Log request paths, status codes, response time, and errors.

Frontend Logs:

Capture critical errors, e.g., failed API calls or unhandled exceptions.

Tools:

ELK stack (Elasticsearch, Logstash, Kibana)

Cloud-native options: AWS CloudWatch Logs, GCP Logging

Third-party SaaS: Datadog, Sentry

Alerting:

Regex-based alerts for critical errors (e.g., database connection errors, API failures).

4. Health Checks & Synthetic Monitoring

Expose /health endpoint on backend for basic liveness check.

Optionally include:

DB connectivity

Critical external API accessibility

Use synthetic checks (Pingdom, UptimeRobot, or CloudWatch Synthetics) to:

Monitor API endpoints and website availability.

Alert when endpoints fail or latency is too high.

5. Security & Vulnerability Monitoring

Monitor for unauthorized access attempts.

Scan for known vulnerabilities in dependencies.

Use services like AWS GuardDuty or GitHub Dependabot alerts.

6. Alerting Strategy

Use multi-channel alerts: email, Slack, Teams, PagerDuty.

Configure thresholds & escalation to avoid alert fatigue:

High CPU > 5 minutes triggers warning.

Persistent errors or downtime triggers critical alerts.

Define clear on-call responsibilities for quick response.

7. Dashboarding

Build dashboards for real-time monitoring:

Backend: endpoint performance, error rates, throughput.

Database: query latency, connections.

Frontend: page load times, error rates.

Tools: Grafana, Kibana, CloudWatch Dashboards.

## Legacy Systems

### 4. Legacy Modernization

**Question:** Walk through your process for modernizing a legacy codebase with minimal disruption.

**Your Answer:** 1. Assessment & Understanding

Before touching any code:

Inventory the codebase: Identify modules, dependencies, and third-party libraries.

Assess pain points: Look for areas that are hard to test, poorly documented, or prone to bugs.

Gather metrics: Analyze test coverage, code complexity, and performance bottlenecks.

Identify critical paths: Determine which parts of the system are most business-critical.

The goal here is to know where the risk is and where to safely make changes.

2. Establish Safety Nets

Modernizing without tests is like walking a tightrope blindfolded.

Write tests first (legacy code characterization):

Unit tests for small, isolated components.

Integration tests for critical flows (like database interactions, API endpoints).

Add monitoring/logging if not already present: helps spot regressions in production.

Use feature flags: so new code paths can be toggled without impacting all users.

3. Define Modernization Goals

Not everything needs a rewrite; define what “modern” means for the team:

Update language version (Python 3.11, Node 18, etc.)

Introduce a framework or patterns (Flask → FastAPI, Redux → Zustand)

Improve structure (modularization, separation of concerns)

Adopt CI/CD pipelines and automated testing

Reduce technical debt

Prioritize changes that give the highest return with minimal risk.

4. Incremental Refactoring

Instead of rewriting everything:

Strangler pattern: replace small pieces of legacy functionality with modern implementations behind the same API.

Module by module refactor: choose low-risk modules first to gain confidence.

Refactor for readability first: rename variables, split functions, add documentation.

Decouple dependencies: isolate third-party code or legacy database access to make future refactors easier.

The key is small, testable, incremental changes, not a big-bang rewrite.

5. Maintain Backward Compatibility

Keep existing interfaces stable for consumers (API endpoints, database schemas).

Use adapter layers if internal structures change.

Deprecate features gradually; communicate changes clearly to stakeholders.

6. CI/CD & Automation

Run automated tests on every commit to catch regressions quickly.

Build staging or QA environments to test modernized pieces safely.

Use feature toggles to deploy modernized code behind flags without affecting all users.

7. Continuous Feedback

Monitor logs, metrics, and user feedback after each modernization step.

Identify regressions or performance impacts early.

Iterate quickly: modernize, test, deploy, evaluate.

8. Documentation & Knowledge Transfer

Keep documentation up to date with refactored modules.

Update onboarding guides for new developers to understand the modernized code.

Encourage code reviews and shared knowledge about patterns introduced.

## Testing

### 5. Test Suite Organization

**Question:** What patterns and practices inform your test suite organization?

**Your Answer:** When organizing a test suite, I rely on patterns and practices that make tests readable, maintainable, and reliable while giving confidence that the system works end-to-end. Here’s my approach broken down:

1. Test Pyramid Structure

I follow the classic test pyramid to balance speed and coverage:

Unit tests (bottom, most tests)

Fast, isolated, no external dependencies.

Test single functions, methods, or small classes.

Example: testing PlayerSchema serialization or a helper that calculates a player’s stats.

Integration tests (middle)

Test multiple components together (e.g., Flask app + SQLAlchemy + SQLite in-memory database).

Example: hitting /players or /pitches endpoints with a test database.

End-to-end / system tests (top, fewest tests)

Simulate real user flows (frontend + backend).

Example: Cypress tests where a user applies filters in the React app and sees the correct players.

2. Logical Organization

I organize tests to mirror the application structure:

unit/
integration/
e2e/

Unit tests focus on logic.

Integration tests focus on API contracts.

E2E tests focus on user experience.

This keeps test files predictable and easy to navigate.

3. Naming Conventions

Test classes: Test<Player|Pitch|Feature>.

Test methods: start with test\_, describe behavior.

Example: test_get_player_by_id_returns_correct_player

Makes test reports readable.

4. Fixtures and Setup/Teardown

Use fixtures for reusable setup, like creating a test client or seeding test data.

Keep database setup isolated per test (rollback transactions or use in-memory DB) to prevent state leakage.

5. Test Coverage and Focus

Unit tests: cover edge cases, input validation, and error handling.

Integration tests: cover API endpoints and database interactions.

E2E tests: cover critical user workflows (filters, table display, form submissions).

Don’t aim for 100% coverage blindly; prioritize high-risk paths.

6. Isolated and Deterministic

Avoid flakiness by isolating external dependencies:

Mock API calls.

Use SQLite in-memory for backend tests.

Seed data predictably.

7. Continuous Integration Integration

All tests run in CI pipeline.

Fail fast on errors.

Optionally generate test coverage reports and highlight regressions.

## Architecture

### 6. Scaling Architecture

**Question:** What architectural choices would you make if tasked to scale this system for millions of daily active users?

**Your Answer:** 1. API & Backend Architecture

Microservices or modular services

Split responsibilities: players-service, pitches-service, stats-service.

Easier horizontal scaling and independent deployments.

Stateless services

Flask API instances don’t store session or state locally.

Scale horizontally behind a load balancer (e.g., AWS ALB, GCP Load Balancer).

Asynchronous tasks for heavy processing

Use Celery + Redis/RabbitMQ for batch computations (e.g., aggregating stats, advanced metrics).

Avoid blocking API requests for long-running computations.

2. Database Choices

Relational for structured data

PostgreSQL or MySQL for players, teams, and pitches.

Sharding or read replicas to handle read-heavy workloads.

Analytics / time-series DB

For pitch tracking, launch speeds, etc., consider TimescaleDB, ClickHouse, or BigQuery.

Optimized for aggregation and reporting on millions of events.

Caching layer

Redis for frequently accessed queries (e.g., top players, recent games).

Can cache precomputed JSON responses for API endpoints.

CDN for static content

Logos, images, and front-end assets served via a CDN (CloudFront, Cloudflare) to offload traffic.

3. Frontend Architecture

Static, CDN-hosted React app

No server-side rendering bottlenecks for initial loads.

Use chunking & lazy loading for large tables (e.g., pitch logs).

Client-side filtering with backend fallback

Small datasets filtered locally; large queries call APIs.

Virtualized tables

Tools like react-virtualized to efficiently render huge tables of players/pitches.

4. Load Balancing & Scaling

Horizontal scaling

Multiple API instances behind a load balancer.

Autoscaling based on CPU, memory, or request rate.

Stateless architecture

All state stored in DB, cache, or external services.

Rate limiting & throttling

Protect APIs from spikes; e.g., 500 requests/min per IP.

5. Observability & Reliability

Monitoring & logging

Prometheus/Grafana for metrics (latency, request rates).

ELK or Loki stack for logs.

Alerting

High latency, 5xx spikes, low cache hit rate.

Distributed tracing

OpenTelemetry / Jaeger to detect slow API calls and bottlenecks.

Health checks

/health endpoints with readiness & liveness probes for orchestration.

6. Deployment & CI/CD

Containerized services

Docker + Kubernetes / ECS / GCP Cloud Run.

Blue/green or canary deployments

Minimize downtime and risk during updates.

Database migrations

Automated with Alembic or Flyway; careful versioning to avoid downtime.

## Opinion

### 7. Overrated Practice

**Question:** What's one commonly-used pattern/practice you think is overrated, and what alternative do you recommend?

**Your Answer:** One pattern I often see treated as mandatory but can be overrated is “everything must be microservices from day one.”

Why it’s overrated:

Teams spin up dozens of tiny services too early.

Complexity skyrockets: distributed transactions, service discovery, logging, observability all get harder.

Deployment pipelines and debugging become more painful than necessary for a small or medium app.

Alternative I recommend:

Start modular monolith:

Keep everything in a single codebase initially, but organize it into clear modules or packages (e.g., players, pitches, stats).

Enforce well-defined interfaces between modules, so they can be extracted later.

Benefits:

Easier testing, simpler CI/CD.

Less operational overhead early on.

Faster developer onboarding.

Split into microservices only when needed:

Once a module has scaling, team, or reliability requirements that justify separation.

You already have clean boundaries, so the transition is smooth.

In short: don’t over-engineer for scale you don’t yet have. Build the foundation right, modularize, and evolve toward microservices when the pain of a monolith becomes real.

If you want, I can give a concrete example applying this to your baseball stats app showing how a modular monolith would look before going microservices.
