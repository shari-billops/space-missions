// Polyfills required by MSW v2 when running under Jest's jsdom environment.
// jsdom replaces the test global with a browser-like object, so Node's native
// Fetch API classes are not always visible as globals even on modern Node.
// Pull them from Node's root context and expose them to Jest before MSW loads.
//
// Keep this file in setupFiles (not setupFilesAfterEnv) so these globals exist
// before src/setupTests.ts imports the MSW server.
const vm = require('node:vm');
const { TextDecoder, TextEncoder } = require('node:util');
const { ReadableStream, WritableStream, TransformStream } = require('node:stream/web');

function getNodeGlobal<T>(name: string): T | undefined {
  try {
    return vm.runInThisContext(name) as T;
  } catch {
    return undefined;
  }
}

const fetchImpl = getNodeGlobal<typeof fetch>('fetch');
const RequestImpl = getNodeGlobal<typeof Request>('Request');
const ResponseImpl = getNodeGlobal<typeof Response>('Response');
const HeadersImpl = getNodeGlobal<typeof Headers>('Headers');
const FormDataImpl = getNodeGlobal<typeof FormData>('FormData');
const BlobImpl = getNodeGlobal<typeof Blob>('Blob');
const FileImpl = getNodeGlobal<typeof File>('File');

if (!global.TextEncoder) Object.defineProperty(global, 'TextEncoder', { configurable: true, value: TextEncoder });
if (!global.TextDecoder) Object.defineProperty(global, 'TextDecoder', { configurable: true, value: TextDecoder });
if (!global.ReadableStream) Object.defineProperty(global, 'ReadableStream', { configurable: true, value: ReadableStream });
if (!global.WritableStream) Object.defineProperty(global, 'WritableStream', { configurable: true, value: WritableStream });
if (!global.TransformStream) Object.defineProperty(global, 'TransformStream', { configurable: true, value: TransformStream });

if (fetchImpl && !global.fetch) Object.defineProperty(global, 'fetch', { configurable: true, value: fetchImpl, writable: true });
if (RequestImpl && !global.Request) Object.defineProperty(global, 'Request', { configurable: true, value: RequestImpl, writable: true });
if (ResponseImpl && !global.Response) Object.defineProperty(global, 'Response', { configurable: true, value: ResponseImpl, writable: true });
if (HeadersImpl && !global.Headers) Object.defineProperty(global, 'Headers', { configurable: true, value: HeadersImpl, writable: true });
if (FormDataImpl && !global.FormData) Object.defineProperty(global, 'FormData', { configurable: true, value: FormDataImpl, writable: true });
if (BlobImpl && !global.Blob) Object.defineProperty(global, 'Blob', { configurable: true, value: BlobImpl, writable: true });
if (FileImpl && !global.File) Object.defineProperty(global, 'File', { configurable: true, value: FileImpl, writable: true });


class MockBroadcastChannel {
  name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onmessageerror: ((event: MessageEvent) => void) | null = null;

  constructor(name: string) {
    this.name = name;
  }

  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() { return true; }
}

if (!global.BroadcastChannel) Object.defineProperty(global, 'BroadcastChannel', { configurable: true, value: MockBroadcastChannel, writable: true });

export {};
