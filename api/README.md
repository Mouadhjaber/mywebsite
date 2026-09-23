# RNE serverless API

`GET /api/rne/search` accepts exactly one query-string field: `q` (the
preferred frontend alias), `query`, or `companyId`. `POST /api/rne/search`
accepts exactly one body field: `query` or `companyId`; `q` is not accepted in
POST bodies. Requests supplying more than one field are rejected, so there is
no ambiguous field precedence. Inputs are trimmed, limited to 120 characters,
and restricted to letters, digits, spaces, `.`, `_`, `-`, and `/`.

The handler currently returns a deterministic `503` response with
`RNE_NOT_CONFIGURED` after input validation. It intentionally makes no RNE
request and returns no financial, company, or document data.

## Vercel setup

Configure these **server-only** Vercel environment variables when official RNE
KYC integration details are available:

- `RNE_KYC_ENDPOINT_URL` — exact provider endpoint supplied by RNE.
- `RNE_KYC_AUTH_SECRET` — provider credential; never use a public/client-prefixed variable.
- `RNE_KYC_AUTH_CONFIGURATION` — provider-approved authorization configuration or reference.

Supplying the variables does not enable calls yet. The endpoint and auth
implementation must be added only from exact official RNE documentation.
Access to RNE financial and documents services must be separately authorized;
this scaffold does not assume that KYC access grants either permission.
