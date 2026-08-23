# Wikipedia Notability Strategy for Mouadh Jaber

## Current Status
- **Two AfC submissions rejected** (March 2026, June 2026)
- **Core issues**: Autobiography (COI), reads like résumé, zero independent secondary sources
- **Requirement**: Multiple reliable, independent sources with significant coverage of *you personally*

---

## Gap Analysis: What's Missing

| Wikipedia Requirement | Your Current Assets | Gap |
|----------------------|---------------------|-----|
| **Independent coverage** | Personal website, LinkedIn, GitHub, Crunchbase (employer pages) | **Zero** — all primary/self-published |
| **Significant coverage** | Worked at notable companies (SocGen, Vermeg, etc.) | Sources discuss *companies*, not *you* |
| **Reliable secondary sources** | Certifications, internal docs | Need: tech journalism, conference proceedings, peer-reviewed papers |
| **Notability trigger** | 15+ years experience | Experience ≠ notability |

---

## Realistic Pathways to Notability

### Tier 1: Achievable in 6–18 months

#### 1. Conference Speaking + Press Coverage
**Target**: Major .NET/Azure/DevOps conferences with media partners
- **NDC (Oslo, London, Copenhagen)** — CfP typically Oct–Jan
- **.NET Conf** (Microsoft, virtual) — high visibility
- **Azure OpenDev / Microsoft Build** — submit session proposals
- **DevOps Days** (Paris, Dubai, etc.) — local chapters
- **Voxxed Days / Devoxx** — European circuit
- **KubeCon / CloudNativeCon** — if Kubernetes angle

**Action**: Submit 3–5 CfPs/year. When accepted, pitch talk summary to:
- *The Register*, *InfoWorld*, *SD Times*, *DevClass*, *TechCrunch EU*, *SiliconAngle*

#### 2. Technical Article in Major Publication
**Target**: Editor-reviewed outlets (not guest posts on blogs)
- *InfoWorld* "Expert Voices" / *The New Stack* / *DZone* (refereed zone) / *MSDN Magazine* (archived) / *Redgate* / *JetBrains* .NET blog
- Pitch: "Lessons from migrating identity to Azure AD B2C with QR/SMS 2FA at scale" (Astera work)
- Pitch: "Dark pool trading systems: FIX/Ultra Messaging in .NET" (SocGen experience)

#### 3. Notable Open Source Project
**Criteria**: External adopters, stars, contributors, ecosystem integration
- **Idea**: .NET library for **ISO 20022 / FIX message parsing** (from Vermeg/SocGen)
- **Idea**: **Flutter + .NET MAUI bridge** for legacy migration (Netcom work)
- **Idea**: **DevSecOps pipeline templates** for Azure + GitHub Actions + Trivy/SonarQube

**Benchmark**: 500+ stars, 3+ external contributors, referenced in 5+ external projects

#### 4. Industry Award / Recognition
- **Microsoft MVP** (Developer Technologies / Azure) — annual cycle, nominate Jul–Sep
- **GitHub Star** — nominated by community
- **CNCF Ambassador** — if Kubernetes focus

---

### Tier 2: Longer-term (1–3 years)

#### 5. Peer-Reviewed Publication
- IEEE Software / ACM Queue / Journal of Systems and Software
- Co-author with academic partner (e.g., "Empirical study of microservice migration in European banking")

#### 6. Book / Definitive Guide
- O'Reilly / Manning / Packt: ".NET Cloud-Native Patterns" or "DevSecOps for Regulated Industries"
- Requires publisher interest → agent → proposal

#### 7. Patent
- File via employer (Netcom) or independently
- USPTO/EPO granted patent in software architecture

---

## Immediate Actions (Next 30 Days)

### 1. Audit Existing "Almost-Sources"
| Source | Type | Usable? | Fix |
|--------|------|---------|-----|
| Crunchbase (Vermeg, Ziwo) | Primary (company DB) | ❌ | Need journalist citing *your role* |
| Wikipedia (ATS, Precision Ag) | Tertiary | ❌ | Cite in articles you write |
| Conference videos (if any) | Primary | ⚠️ | Need third-party writeup |
| Internal case studies | Primary | ❌ | Publish sanitized version externally |

### 2. Create Media Assets
- **One-pager**: "5 technical stories I can tell" (for journalist pitches)
- **Headshot + bio** (30/100/200 word versions)
- **Speaking topics** with abstracts (ready for CfP)

### 3. Identify 10 Target Journalists
Research who covers:
- .NET / C# / Azure (e.g., *The Register*: Tim Anderson; *InfoWorld*: Paul Krill; *SD Times*: David Rubinstein)
- DevSecOps / Identity / Fintech tech
- Follow on Twitter/X, engage with their articles

### 4. Schedule First Conference CfP
- Check NDC London (Jan), Devoxx France (Apr), .NET Conf (Nov)
- Submit 2 proposals by deadline

---

## Content You Can Publish *Now* (Independent Platforms)

> **Rule**: Publish on platforms with editorial oversight, not your blog.

| Platform | Editorial Control | Credibility |
|----------|-------------------|-------------|
| **The New Stack** | Yes (pitch required) | High |
| **InfoWorld Expert Voices** | Yes (by invitation/application) | High |
| **DZone Refcardz / Articles** | Yes (reviewed) | Medium-High |
| **Microsoft Tech Community** | Light (Microsoft staff) | Medium |
| **Redgate / JetBrains / Progress blogs** | Yes (vendor but edited) | Medium |
| **Dev.to / Medium / Hashnode** | No (self-pub) | **Does not count** |

---

## Sample Pitch Email to Journalists

```
Subject: Story: How a French bank migrated 20-yr trading stack to .NET Core + Kafka

Hi [Journalist Name],

I read your piece on [recent article] — particularly the point about [specific detail].

I led the backend modernization for Société Générale's dark pool trading system (2014–2016), migrating from C++/FIX to .NET Core with Ultra Messaging and Kafka. We processed 50K+ msgs/sec with sub-ms latency under MiFID II constraints.

Happy to share anonymized architecture diagrams, latency benchmarks, and lessons on regulatory compliance in event-driven systems. No PR fluff — just technical depth.

Available for background or on-record. Based in Paris/Tunis, fluent EN/FR/AR.

Best,
Mouadh Jaber
Senior .NET Engineer | Ex-SocGen, Vermeg, Astera
[LinkedIn] | [GitHub] | [Personal site with Schema.org Person markup]
```

---

## Wikipedia-Specific Tactics (Once Sources Exist)

1. **Do not write the article yourself** — COI violation
2. **Request article via Wikipedia:Articles for creation** with **all sources pre-linked**
3. **Declare COI** on talk page: `{{connected contributor (paid)}}` or similar
4. **Neutral tone checklist**:
   - No "I", "we", "my", "our"
   - No "successfully", "innovative", "leading", "expert"
   - No lists of technologies without context
   - Chronological narrative with inline citations after *every sentence*
5. **Structure**:
   - Lead: 2–3 sentences, who/what/why notable
   - Career: reverse-chronological, each role 1 paragraph + citations
   - Notable work: 2–3 projects with independent coverage
   - Recognition: awards, MVP, speaking (with sources)
   - References: 8+ reliable secondary sources

---

## Tracking Template

| Target | Type | Deadline | Status | Source URL (when published) |
|--------|------|----------|--------|----------------------------|
| NDC London CfP | Conference | Oct 2026 | ⬜ Planned | |
| The New Stack pitch | Article | Nov 2026 | ⬜ Planned | |
| Microsoft MVP nomination | Award | Sep 2026 | ⬜ Planned | |
| FIX parser OSS | Open source | Q1 2027 | ⬜ Planned | |
| DevOps Days Paris | Conference | Q1 2027 | ⬜ Planned | |

---

## Decision Gate

**Re-evaluate in 12 months**. If you have:
- 3+ independent secondary sources with significant coverage
- OR 1 major award (MVP) + 2 sources
- OR 1 notable OSS project (500+ stars) + 2 sources

→ Then consider AfC submission. Otherwise, continue building.

---

## Resources
- [WP:BIO](https://en.wikipedia.org/wiki/Wikipedia:Notability_(people)) — notability for people
- [WP:SECONDARY](https://en.wikipedia.org/wiki/Wikipedia:Secondary) — secondary sources
- [WP:COI](https://en.wikipedia.org/wiki/Wikipedia:Conflict_of_interest) — conflict of interest
- [WP:AFC](https://en.wikipedia.org/wiki/Wikipedia:Articles_for_creation) — submission process
- [WP:SOLUTIONS](https://en.wikipedia.org/wiki/Wikipedia:SOLUTIONS) — what to do if not notable

---

*Generated from your website data. Update as you secure sources.*