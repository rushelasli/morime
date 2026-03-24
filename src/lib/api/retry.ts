export interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  timeout?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 2,
  delayMs: 500,
  backoffMultiplier: 2,
  timeout: 30000,
};

export class RetryError extends Error {
  constructor(
    message: string,
    public readonly lastError: Error,
    public readonly attempts: number
  ) {
    super(message);
    this.name = "RetryError";
  }
}

/**
 * Retries an async function with exponential backoff.
 * Useful for handling rate limiting and transient API failures.
 *
 * @param fn - Async function to retry
 * @param options - Retry configuration options
 * @returns Promise that resolves with the function result
 * @throws RetryError if all retries are exhausted
 */
export async function retryWithBackoff<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | null = null;
  let delay = config.delayMs;

  for (let attempt = 1; attempt <= config.maxRetries + 1; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      try {
        const result = await fn();
        clearTimeout(timeoutId);
        return result;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on certain error types
      if (lastError.message.includes("404") || lastError.message.includes("401") || lastError.message.includes("403")) {
        throw lastError;
      }

      // On last attempt, throw the error
      if (attempt > config.maxRetries) {
        throw new RetryError(`Failed after ${attempt} attempts: ${lastError.message}`, lastError, attempt);
      }

      // Log retry attempt
      if (process.env.NODE_ENV === "development") {
        console.warn(`[Retry ${attempt}/${config.maxRetries}] Retrying in ${delay}ms due to: ${lastError.message}`);
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= config.backoffMultiplier;
    }
  }

  // Should never reach here, but just in case
  throw new RetryError(
    `Failed after ${config.maxRetries + 1} attempts`,
    lastError || new Error("Unknown error"),
    config.maxRetries + 1
  );
}

/**
 * Wraps an async function with retry logic.
 * Returns a new function that automatically retries on failure.
 *
 * @param fn - Async function to wrap
 * @param options - Retry configuration options
 * @returns Wrapped function that retries automatically
 */
export function withRetry<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  options?: RetryOptions
): (...args: Args) => Promise<T> {
  return (...args: Args) => retryWithBackoff(() => fn(...args), options);
}
