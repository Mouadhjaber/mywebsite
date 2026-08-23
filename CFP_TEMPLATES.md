# Conference CfP Templates — Mouadh Jaber

Use these as starting points. Customize per conference theme. Submit 3–5 per cycle.

---

## Template 1: Event-Driven Architecture in Regulated .NET Systems
**Target**: NDC, Devoxx, .NET Conf, DevOps Days, Voxxed Days
**Track**: Architecture / .NET / Cloud / Fintech

### Title Options
- Event-Driven Architecture in Regulated .NET Systems: From FIX to Kafka
- Building Auditable Event-Driven Systems in .NET: MiFID II, ISO 20022, and the Outbox Pattern
- Kafka, FIX, and Ultra Messaging: Event Streaming in European Banking

### Abstract (300–400 words)
Event-driven architecture promises decoupling and scalability — but in regulated finance, every event must be auditable, replayable, and exactly-once. This session draws from modernizing Société Générale's dark pool trading system (C++/FIX/Ultra Messaging → .NET Core/Kafka) and Vermeg's ISO-compliant liquidation platform.

We'll cover:
- **The outbox pattern** for transactional event publishing without distributed transactions
- **Idempotency keys** and consumer-side deduplication for exactly-once semantics
- **Schema registry** (Avro/Protobuf) evolution under regulatory change management
- **Audit trails**: correlating business events, technical logs, and regulatory reports
- **Testing**: contract testing with Pact, chaos engineering with Kafka, production traffic replay
- **MiFID II / ISO 20022** compliance as architecture constraints, not afterthoughts

You'll leave with a reference architecture (GitHub repo shared post-talk) applicable to any .NET system requiring regulatory auditability: trading, payments, insurance claims, pharmaceutical supply.

### Learning Outcomes
1. Implement the outbox pattern in EF Core / Dapper with zero data loss
2. Design idempotent consumers for Kafka / Azure Service Bus / RabbitMQ
3. Structure audit logs for regulator-friendly reconstruction
4. Apply contract testing to event schemas in CI/CD

### Speaker Bio (50 words)
Mouadh Jaber is a Senior .NET Engineer with 15+ years architecting regulated systems for Société Générale, Candriam, Vermeg, and Astera. He specializes in .NET cloud-native architecture, event-driven systems (Kafka, FIX, Ultra Messaging), DevSecOps, and identity platforms. Based Paris/Tunis.

### Tags
`#dotnet` `#architecture` `#kafka` `#fintech` `#eventdriven` `#audit` `#mifid2`

---

## Template 2: Identity as a Platform — Zero-Downtime Migration to IdentityServer
**Target**: NDC, Devoxx, .NET Conf, Identity-focused events (OAuth Summit, etc.)
**Track**: Security / Identity / Architecture

### Title Options
- Identity as a Platform: Migrating 15 Apps to Duende IdentityServer with Passwordless 2FA
- Zero-Downtime Identity Migration: QR/SMS 2FA, Token Translation, and Rollback Strategies
- From ADFS to IdentityServer: Lessons from a Pharma Supply Chain Modernization

### Abstract (300–400 words)
Identity is the new perimeter — but migrating 15 legacy applications (ASP.NET MVC, WebForms, WPF, WCF) from ADFS/custom membership to Duende IdentityServer without downtime is a different beast. This session shares the playbook from Astera (pharmaceutical supply, 10K+ users), where we rolled out passwordless QR/SMS 2FA during the post-COVID remote-work shift.

Topics:
- **Hybrid flow migration**: running old and new identity side-by-side with token translation middleware
- **Passwordless 2FA**: custom IdentityServer credential types for QR-code (printed badges) and SMS fallback — why authenticator apps failed for warehouse staff
- **Session migration**: preserving user sessions across identity providers without re-login
- **Rollback plan**: feature flags, canary user groups, 15-minute rollback SLA
- **Post-launch monitoring**: sign-in success rates, 2FA adoption, support ticket deflection
- **Organizational change**: security team, helpdesk, and user communication playbooks

Includes sanitized architecture diagrams, middleware code samples, and a migration checklist template.

### Learning Outcomes
1. Design a zero-downtime identity migration strategy for brownfield .NET estates
2. Implement custom credential types in Duende IdentityServer
3. Build token translation middleware for hybrid auth flows
4. Measure and communicate migration success to non-technical stakeholders

### Speaker Bio (50 words)
Mouadh Jaber led the IdentityServer migration at Astera (Rouen), implementing QR/SMS 2FA across 15 applications for 10K+ pharmaceutical supply-chain users. 15+ years .NET, Azure, DevSecOps, regulated systems. Ex-SocGen, Vermeg, Candriam.

### Tags
`#identityserver` `#oidc` `#security` `#migration` `#passwordless` `#dotnet` `#azuread`

---

## Template 3: DevSecOps for .NET in Regulated Industries
**Target**: DevOps Days, NDC, Devoxx, .NET Conf, CloudNativeSecurityCon
**Track**: DevOps / Security / Cloud / Compliance

### Title Options
- DevSecOps for .NET in Regulated Industries: Pipeline Gates That Auditors Accept
- From "Works on My Machine" to ISO 27001 Evidence: Policy-as-Code for .NET Pipelines
- DevSecOps Without Slowing Down: SAST, SCA, Container Scan, SBOM in Azure DevOps/GitHub Actions

### Abstract (300–400 words)
"We need DevSecOps" — but in banking/insurance/pharma, every gate must produce auditor-ready evidence. This session shows how to build Azure DevOps / GitHub Actions pipelines that enforce security *and* generate compliance artifacts for ISO 27001, MiFID II, GDPR, and FDA 21 CFR Part 11.

Live demo of a .NET 8 microservice pipeline with:
- **SAST**: SonarQube quality gates mapped to CWE/OWASP Top 10
- **SCA**: Dependency scanning with license compliance (SPDX SBOM generation)
- **Container security**: Trivy + Cosign signing + Kyverno policy enforcement on AKS
- **DAST**: OWASP ZAP in pipeline against review environments
- **Secrets detection**: TruffleHog + GitLeaks with false-positive suppression
- **Policy-as-Code**: OPA/Gatekeeper for AKS admission control + Azure Policy for subscription guardrails
- **Evidence packaging**: automatic artifact collection for audit (pipeline runs, scan reports, deployment approvals)

All YAML/Bicep/Bicep shared. Applicable to GitHub Actions, Azure DevOps, GitLab CI.

### Learning Outcomes
1. Map each pipeline gate to a specific regulatory control
2. Generate SPDX SBOMs and VEX documents in .NET pipelines
3. Implement Kyverno/OPA policies for .NET container workloads
4. Build an "audit packet" that satisfies ISO 27001 Annex A controls

### Speaker Bio (50 words)
Mouadh Jaber implements DevSecOps pipelines for regulated .NET systems (banking, pharma, insurance). Recent: Azure DevOps + GitHub Actions with SonarQube, Trivy, Kyverno, OPA for ISO 27001/MiFID II evidence. 15+ years .NET, Azure, event-driven architecture.

### Tags
`#devsecops` `#dotnet` `#azure` `#githubactions` `#compliance` `#iso27001` `#sbom` `#policyascode`

---

## Template 4: Legacy Modernization Patterns in .NET
**Target**: NDC, Devoxx, .NET Conf, Software Architecture conferences
**Track**: Architecture / Legacy / .NET

### Title Options
- Strangler Fig, Anti-Corruption Layer, and Domain Extraction: Modernizing 20-Year-Old .NET Systems
- From Pascal/Delphi to .NET Core: Reverse Engineering a Disease Prediction Engine
- Legacy Modernization Patterns That Actually Work in Regulated .NET Environments

### Abstract (300–400 words)
Every .NET developer inherits legacy — but in regulated industries, you can't just "rewrite." This session distills patterns from four modernizations: SocGen trading (C++/FIX → .NET Core/Kafka), Astera identity (ADFS → IdentityServer), InVivo ag-engine (Pascal/Delphi → WCF/REST), Vermeg liquidation (C++/Delphi → .NET Core).

Patterns covered:
- **Strangler Fig with canary replay**: capturing 6 months production traffic, replaying against new service, comparing outputs
- **Anti-Corruption Layer**: translating legacy domain models (Delphi records, C++ structs) to clean DDD aggregates
- **Database-first extraction**: using EF Core reverse engineering + change data capture (Debezium) for zero-downtime cutover
- **Feature-flag-driven migration**: LaunchDarkly / Azure App Configuration for per-tenant rollout
- **Observability as migration safety net**: distributed tracing (OpenTelemetry), business metrics, automated rollback triggers
- **Team topology**: enabling stream-aligned teams to own slices of the legacy monolith

Includes decision matrix: when to rewrite vs. wrap vs. replace; cost/risk models for regulated environments.

### Learning Outcomes
1. Choose the right modernization pattern for your constraints
2. Design an ACL that isolates domain logic from legacy quirks
3. Build a canary replay harness for .NET services
4. Structure team ownership for incremental legacy displacement

### Speaker Bio (50 words)
Mouadh Jaber has modernized four regulated .NET/C++/Delphi systems (SocGen, Astera, InVivo, Vermeg). 15+ years .NET, Azure, DDD, event-driven architecture, DevSecOps. Specializes in zero-downtime migration under audit constraints.

### Tags
`#legacy` `#modernization` `#stranglerfig` `#antcorruptionlayer` `#ddd` `#dotnet` `#architecture`

---

## Submission Checklist (Per Conference)

- [ ] Read CfP guidelines (word limits, themes, anonymized review?)
- [ ] Select 1–2 best-fit templates
- [ ] Customize title for conference theme
- [ ] Tailor abstract to audience level (beginner/intermediate/advanced)
- [ ] Add 1–2 concrete "you will learn" bullets
- [ ] Prepare 3-min video pitch (if required)
- [ ] Submit before deadline (set calendar reminder 1 week prior)
- [ ] Track in outreach tracker (see OUTREACH_TRACKER.md)
- [ ] If accepted: prepare slides 3 weeks out, rehearse 2x

---

## Conference Calendar 2026–2027 (Key Deadlines)

| Conference | Location | CfP Opens | CfP Closes | Event Date | Notes |
|------------|----------|-----------|------------|------------|-------|
| NDC Oslo | Oslo, NO | Oct 2026 | Jan 2027 | Jun 2027 | Premier .NET |
| NDC London | London, UK | Jul 2026 | Oct 2026 | Jan 2027 | Strong .NET |
| Devoxx France | Paris, FR | Oct 2026 | Jan 2027 | Apr 2027 | FR/EN, local |
| .NET Conf | Virtual | Aug 2026 | Oct 2026 | Nov 2026 | Microsoft, high reach |
| DevOps Days Paris | Paris, FR | Rolling | ~2 mo prior | Quarterly | Community |
| DevOps Days Dubai | Dubai, UAE | Rolling | ~2 mo prior | Quarterly | Gulf reach |
| Voxxed Days Luxembourg | Luxembourg | Sep 2026 | Dec 2026 | Feb 2027 | Intimate |
| CloudNativeSecurityCon | Virtual/rotating | Varies | Varies | Varies | CNCF |
| OAuth Summit | Virtual/rotating | Varies | Varies | Varies | Identity focus |

> Check each site for exact dates. Submit to 3+ per cycle.