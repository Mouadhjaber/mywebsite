"use strict";

const ALLOWED_METHODS = ["GET"];
const ALLOWED_PARAMS = new Set(["page", "pageSize"]);

function sendJson(response, status, payload) {
  response.status(status).json(payload);
}

function parsePositiveInteger(value, maximum) {
  if (Array.isArray(value) || typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed > maximum) return null;
  return parsed;
}

function getPagination(query) {
  if (!query || typeof query !== "object") return null;

  const keys = Object.keys(query);
  if (keys.some((key) => !ALLOWED_PARAMS.has(key))) return null;
  if (!Object.prototype.hasOwnProperty.call(query, "page") || !Object.prototype.hasOwnProperty.call(query, "pageSize")) {
    return null;
  }

  const page = parsePositiveInteger(query.page, Number.MAX_SAFE_INTEGER);
  const pageSize = parsePositiveInteger(query.pageSize, 50);
  if (page === null || pageSize === null) return null;

  return { page, pageSize };
}

/**
 * Vercel serverless entry point reserved for an authorized RNE company listing.
 * It makes no upstream request until provider endpoint, schema, license, and
 * permission requirements have been supplied and reviewed.
 */
module.exports = function handler(request, response) {
  if (!ALLOWED_METHODS.includes(request.method)) {
    response.setHeader("Allow", "GET");
    return sendJson(response, 405, {
      error: { code: "METHOD_NOT_ALLOWED", message: "Use GET for this resource." },
    });
  }

  if (!getPagination(request.query)) {
    return sendJson(response, 400, {
      error: {
        code: "INVALID_PAGINATION",
        message: "Provide exactly one positive integer page and one pageSize integer from 1 to 50, without duplicate or unknown parameters.",
      },
    });
  }

  // Intentionally do not read or return RNE_COMPANIES_LISTING_AUTH_SECRET.
  return sendJson(response, 503, {
    error: {
      code: "RNE_COMPANIES_NOT_CONFIGURED",
      message: "RNE company listing is not configured. Authorized provider documentation is required.",
    },
  });
};
