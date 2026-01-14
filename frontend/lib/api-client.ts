const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiRequestOptions extends RequestInit {
  rawBody?: boolean;
  method?: HttpMethod;
}

export async function apiFetch<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const url = `${API_BASE_URL}${path}`;

  const headers = new Headers(options.headers);

  if (!options.rawBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const init: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  const response = await fetch(url, init);

  if (!response.ok) {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      // ignore
    }

    const error: any = new Error(
      (errorBody as any)?.detail ||
        `Request failed with status ${response.status}`,
    );
    error.status = response.status;
    error.body = errorBody;
    throw error;
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const data = (await response.json()) as TResponse;
  return data;
}

export async function apiPost<TResponse, TBody = unknown>(
  path: string,
  body?: TBody,
  options: ApiRequestOptions = {},
) {
  return apiFetch<TResponse>(path, {
    method: "POST",
    body: body && !options.rawBody ? JSON.stringify(body) : (body as any),
    ...options,
  });
}

export async function apiGet<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
) {
  return apiFetch<TResponse>(path, {
    method: "GET",
    ...options,
  });
}




