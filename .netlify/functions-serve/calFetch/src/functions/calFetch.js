var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// functions/calFetch.js
var calFetch_exports = {};
__export(calFetch_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(calFetch_exports);
var { CAL_API, CAL_ID } = process.env;
var BASEPARAMS = `orderBy=startTime&singleEvents=true&timeMin=${new Date().toISOString()}`;
var BASEURL = `https://www.googleapis.com/calendar/v3/calendars/${CAL_ID}/events?${BASEPARAMS}`;
var HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "GET"
};
async function handler(event, context) {
  const finalURL = `${BASEURL}${event.queryStringParameters.maxResults ? `&maxResults=${event.queryStringParameters.maxResults}` : ""}&key=${CAL_API}`;
  try {
    if (event.httpMethod === "GET") {
      return fetch(finalURL).then((response) => response.json()).then((data) => ({
        statusCode: 200,
        body: JSON.stringify(data.items, null, 2),
        HEADERS
      }));
    }
    return {
      statusCode: 401
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: e.toString()
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=calFetch.js.map
