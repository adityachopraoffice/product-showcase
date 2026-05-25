const DEFAULT_RETRY_ON = new Set([503]);

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithRetry(
  fetchImpl,
  input,
  init = {},
  {
    retries = 3,
    initialDelay = 500,
    maxDelay = 4000,
    retryOn = DEFAULT_RETRY_ON,
  } = {},
) {
  let attempt = 0;
  let waitMs = initialDelay;

  while (true) {
    const response = await fetchImpl(input, init);

    if (!retryOn.has(response.status) || attempt >= retries) {
      return response;
    }

    attempt += 1;
    await delay(waitMs);
    waitMs = Math.min(maxDelay, waitMs * 2);
  }
}

export function applyFetchRetry(globalScope = globalThis, options = {}) {
  if (globalScope.__retryFetchPatched) {
    return;
  }

  const originalFetch = globalScope.fetch.bind(globalScope);

  globalScope.fetch = async (...args) =>
    fetchWithRetry(originalFetch, ...args, options);

  globalScope.__retryFetchPatched = true;
}
