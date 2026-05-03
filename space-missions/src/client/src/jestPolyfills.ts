// Polyfill Fetch API globals required by MSW v2.
// jest-environment-jsdom uses jsdom which does not include the Fetch API.
// Node 23 provides these natively — expose them on global so MSW can use them.
const nodeFetch = globalThis.fetch;
const nodeRequest = globalThis.Request;
const nodeResponse = globalThis.Response;
const nodeHeaders = globalThis.Headers;

if (nodeFetch) Object.defineProperty(global, 'fetch', { value: nodeFetch, writable: true });
if (nodeRequest) Object.defineProperty(global, 'Request', { value: nodeRequest, writable: true });
if (nodeResponse) Object.defineProperty(global, 'Response', { value: nodeResponse, writable: true });
if (nodeHeaders) Object.defineProperty(global, 'Headers', { value: nodeHeaders, writable: true });
