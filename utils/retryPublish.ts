export type RetryOptions = {
  maxAttempts?: number
  retryDelay?: number
}

export async function retryPublish<T extends { status: number }>(
  publishAction: () => Promise<T>,
  options: RetryOptions = {}
) {
  const maxAttempts = options.maxAttempts ?? 3
  const retryDelay = options.retryDelay ?? 3000

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = await publishAction()

    if (result.status !== 409) {
      return result
    }

    if (attempt < maxAttempts - 1) {
      await new Promise(resolve => setTimeout(resolve, retryDelay))
    }
  }
}
