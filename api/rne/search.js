"use strict";

const ALLOWED_METHODS = ["GET", "POST", "OPTIONS"];
const MAX_INPUT_LENGTH = 120;
const IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 ._\-/]{0,119}$/;

function sendJson(response, status, payload) {
  response.status(status).json(payload);
}

function setCorsHeaders(response) {
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function getInput(request) {
  const source = request.method === "GET" ? request.query : request.body;
  if (!source || typeof source !== "object") return null;

  // `q` is the preferred GET alias. POST intentionally retains only the
  // documented `query` and `companyId` body fields.
  const fields = request.method === "GET" ? ["q", "query", "companyId"] : ["query", "companyId"];
  const suppliedFields = fields.filter((field) => source[field] !== undefined);
  if (suppliedFields.length !== 1) {
    return null;
  }

  const value = source[suppliedFields[0]];
  if (Array.isArray(value) || typeof value !== "string") return null;

  const normalized = value.trim();
  if (!normalized || normalized.length > MAX_INPUT_LENGTH || !IDENTIFIER_PATTERN.test(normalized)) {
    return null;
  }

  return normalized;
}

/**
 * Vercel serverless entry point for an eventual RNE KYC integration.
 * No RNE request is made until the provider's exact endpoint and authorization
 * documentation has been reviewed and implemented.
 */
module.exports = function handler(request, response) {
  setCorsHeaders(response);

  if (!ALLOWED_METHODS.includes(request.method)) {
    response.setHeader("Allow", ALLOWED_METHODS.join(", "));
    return sendJson(response, 405, {
      error: { code: "METHOD_NOT_ALLOWED", message: "Use GET or POST for this resource." },
    });
  }

  if (request.method === "OPTIONS") {
    return response.status(204).end();
  }

  if (!getInput(request)) {
    return sendJson(response, 400, {
      error: {
        code: "INVALID_SEARCH_INPUT",
        message: "Provide exactly one non-empty query or companyId value of up to 120 characters.",
      },
    });
  }

  // Intentionally do not read or return RNE_KYC_AUTH_SECRET here. The future
  // request implementation must be based on official RNE endpoint/auth docs.
  return sendJson(response, 503, {
    error: {
      code: "RNE_NOT_CONFIGURED",
      message: "RNE search is not configured. Provider endpoint and authorization documentation are required.",
    },
  });
};
