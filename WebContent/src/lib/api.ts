import {errorDtoSchema} from "@/models/error-dto"
import type {AppText} from "@/lib/app-text"

interface ApiBaseResponse {code: number}
interface ApiErrorResponse extends ApiBaseResponse {error: AppText | null}
interface ApiSuccessResponse extends ApiBaseResponse {response: Response}
export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export function isApiError(response: ApiResponse): response is ApiErrorResponse {
  return "error" in response
}
export function isApiSuccess(response: ApiResponse): response is ApiSuccessResponse {
  return "response" in response
}

export const api = {
  post: (url: RequestInfo | URL, data: object, signal?: AbortSignal): Promise<ApiResponse> => {
    return fetchInternal(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal
    })
  },
  get: (url: RequestInfo | URL, signal?: AbortSignal): Promise<ApiResponse> => {
    return fetchInternal(url, {
      method: "GET",
      signal
    })
  }
}

async function fetchInternal(
  url: RequestInfo | URL,
  init?: RequestInit
): Promise<ApiResponse> {
  let res: Response
  try {
    res = await fetch(url, {
      credentials: "include",
      ...init
    })
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      return { code: -2, error: null }
    }
    // Network error
    return { code: -1, error: { kind: "i18n", key: "common:errors.network" } }
  }

  if (res.status === 502) {
    // Network error
    return { code: res.status, error: { kind: "i18n", key: "common:errors.network" } }
  }

  if (res.status >= 400 && res.status < 600) {
    const parsed = errorDtoSchema.safeParse(await res.json().catch(() => null))

    if (parsed.success)
      return { code: res.status, error: { kind: "translated", text: parsed.data.message } }

    console.error(parsed.error)
    return { code: res.status, error: { kind: "translated", text: "common:errors.unknown" } }
  }

  return { code: res.status, response: res }
}