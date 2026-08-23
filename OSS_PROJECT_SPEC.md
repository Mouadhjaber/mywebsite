# FIX / ISO 20022 Parser for .NET — Project Spec

**Goal**: Build a notable open-source project (500+ stars, 3+ external contributors) that demonstrates expertise and attracts independent coverage.

---

## Why This Project

- **Directly from your experience**: SocGen (FIX/Ultra Messaging), Vermeg (ISO 20022 liquidation)
- **Market gap**: No mature, actively maintained .NET library for both FIX and ISO 20022
- **Commercial adoption potential**: Fintechs, banks, trading platforms need this
- **Citable artifact**: "Author of [lib], used by X companies" → independent source

---

## Scope (MVP → v1.0)

### MVP (v0.1, 4 weeks)
- [ ] FIX 4.2/4.4 parser (tag-value, binary)
- [ ] Message validation (required fields, checksum)
- [ ] ISO 20022 (MX) parser for pain.001, pain.002, pacs.008, pacs.009
- [ ] Fluent builder API for both
- [ ] Benchmarks vs. QuickFixN
- [ ] MIT license, NuGet package

### v0.5 (Beta, +6 weeks)
- [ ] FIX session layer (initiator/acceptor, heartbeat, replay)
- [ ] ISO 20022 schema validation (XSD)
- [ ] Extension points for custom fields
- [ ] Source generators for DTOs
- [ ] 3 external adopters (GitHub issues showing production use)

### v1.0 (Stable, +8 weeks)
- [ ] Full FIX 5.0 SP2 dictionary
- [ ] ISO 20022 2023+ message set (camt, acmt, auth)
- [ ] Performance: < 1μs parse/serialize on .NET 8
- [ ] Documentation site (DocFX)
- [ ] .NET Foundation application

---

## Architecture

```
src/
├── FixParser/           # FIX tag-value + binary
│   ├── Parser/
│   ├── Validator/
│   ├── Dictionary/      # Embedded DataDictionary (FIX 4.2–5.0)
│   └── Session/         # v0.5+
├── Iso20022Parser/      # MX messages
│   ├── Parser/
│   ├── Validator/       # XSD-based
│   ├── Messages/        # Generated DTOs (pain, pacs, camt, acmt, auth)
│   └── Serialization/
├── Shared/
│   ├── Extensions/
│   ├── SourceGenerators/ # DTO generation from XSD/DataDictionary
│   └── Benchmarks/
tests/
├── FixParser.Tests/
├── Iso20022Parser.Tests/
├── Integration.Tests/   # Real-world samples
benchmarks/
└── Benchmarks/          # BenchmarkDotNet
```

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Target | .NET 8+ (net8.0, net9.0) | LTS + latest perf |
| Parser | `System.IO.Pipelines` + `Utf8Parser` | Zero-allocation, high throughput |
| Validation | Compiled regex + source-gen | Fast, AOT-friendly |
| Serialization | `System.Text.Json` + custom converters | Standard, fast |
| Testing | xUnit, FluentAssertions, NSubstitute | Modern |
| Benchmarks | BenchmarkDotNet | Industry standard |
| CI/CD | GitHub Actions | Free, integrated |
| Packaging | NuGet, GitHub Packages | Standard |
| Docs | DocFX + GitHub Pages | Professional |

---

## Key Differentiators

1. **Dual-protocol**: FIX *and* ISO 20022 in one lib (unique)
2. **Zero-allocation parsing**: `ReadOnlySequence<byte>` → DTO without string allocation
3. **Source generators**: Compile-time DTO generation from FIX DataDictionary / ISO XSD
4. **Regulatory-first**: Built-in validation rules for MiFID II, ISO 20022 compliance
4. **Session layer**: Production-ready FIX engine (v0.5+), not just parser

---

## Sample API

```csharp
// FIX parsing (zero-alloc)
var parser = new FixParser();
ReadOnlySequence<byte> buffer = GetNetworkBuffer();
FixMessage msg = parser.Parse(buffer); // No string allocation

// Fluent builder
var order = FixMessageBuilder.New(FixMsgType.NewOrderSingle)
    .SetTag(FixTags.ClOrdId, "ORDER-123")
    .SetTag(FixTags.Symbol, "AAPL")
    .SetTag(FixTags.Side, FixSide.Buy)
    .SetTag(FixTags.OrderQty, 100m)
    .SetTag(FixTags.OrdType, FixOrdType.Limit)
    .SetTag(FixTags.Price, 150.25m)
    .Build();

// ISO 20022 (pain.001)
var pain001 = new Document
{
    CstmrCdtTrfInitn = new CustomerCreditTransferInitiationV09
    {
        GrpHdr = new GroupHeader91 { MsgId = "MSG-001", CreDtTm = DateTime.UtcNow },
        PmtInf = new List<PaymentInstruction30> { ... }
    }
};
byte[] xml = Iso20022Serializer.Serialize(pain001, IsoVersion.V2019); // Validated against XSD
```

---

## First 4 Weeks: Sprint Plan

### Week 1: Foundation
- [ ] Repo init, GitHub Actions (build, test, pack, publish prerelease)
- [ ] `FixParser` core: `ReadOnlySequence<byte>` parser, tag dictionary (embedded resource)
- [ ] Unit tests: parse 50+ real FIX samples (from QuickFix test data)
- [ ] Benchmark harness vs. QuickFixN

### Week 2: FIX MVP
- [ ] Message validation (required tags, checksum, repeating groups)
- [ ] Fluent builder API
- [ ] Binary FIX (FIXP/SBE) stub
- [ ] NuGet prerelease publish

### Week 3: ISO 20022 MVP
- [ ] XSD loading + validation (cached `XmlSchemaSet`)
- [ ] Source generator: XSD → C# DTOs (partial classes for extensibility)
- [ ] pain.001, pain.002, pacs.008, pacs.009 DTOs
- [ ] Round-trip tests: XML → DTO → XML (canonical)

### Week 4: Polish & Launch
- [ ] README with benchmarks, API examples, migration guide from QuickFixN
- [ ] GitHub Discussions + Issue templates
- [ ] Announce on: Reddit r/dotnet, r/algotrading, LinkedIn, Twitter, .NET Foundation Slack
- [ ] Submit to Awesome-DotNet, Awesome-Fintech

---

## Adoption Strategy (Get External Users)

1. **Dogfood at Netcom**: Use in current Flutter/.NET migration
2. **Target 3 fintech startups**: Cold email CTOs — "Free FIX/ISO parser, production-ready, MIT"
3. **Answer StackOverflow**: Tag `quickfixn`, `fix-protocol`, `iso20022` — link lib
4. **Write 2 technical articles**: "Parsing FIX at 1M msgs/sec on .NET 8", "ISO 20022 in .NET without XSD nightmares"
5. **Speak at 1 meetup**: "Building a FIX Engine in Modern .NET" (record → YouTube)

---

## Success Metrics

| Metric | MVP | v0.5 | v1.0 |
|--------|-----|------|------|
| GitHub Stars | 50 | 200 | 500 |
| External Contributors | 0 | 2 | 5 |
| NuGet Downloads/day | 10 | 100 | 500 |
| Production Adopters | 1 (Netcom) | 3 | 10 |
| Blog/Article Mentions | 0 | 2 | 5 |
| Conference Talks | 0 | 1 | 3 |

---

## Legal / IP

- **License**: MIT (permissive, commercial-friendly)
- **CLA**: Contributor License Agreement (simple, in PR template)
- **Trademark**: "FixParser" — consider .NET Foundation for neutral governance at v1.0
- **Employer IP**: Confirm Netcom allows OSS contributions (standard clause)

---

## Next Actions (This Week)

1. [ ] Create private repo `fixparser` on GitHub
2. [ ] Set up GitHub Actions workflow (build → test → pack → publish to GitHub Packages)
3. [ ] Scaffold `FixParser` project with `System.IO.Pipelines` parser skeleton
4. [ ] Download QuickFix test suite + real FIX logs for test corpus
5. [ ] Block 2 hrs/day for 4 weeks on calendar

---

*This project alone, if executed, creates a citable, independent technical artifact that directly supports notability.*