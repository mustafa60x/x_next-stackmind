import Cookies from "js-cookie";
export class BaseRepository {
  protected async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Copy existing headers if any
    if (options?.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (typeof value === "string") {
          headers[key] = value;
        }
      });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      ...options,
      headers,
    });

    if (response.ok) {
      return response.json();
    }

    // Error handling
    if (response?.status === 401) {
      // Unauthorized - Token'ı temizle
      Cookies.remove("access_token");
      // Oturum açma sayfasına yönlendir
      window.location.href = "/login";
    }
    // 403
    if (response.status === 403) throw new Error("Forbidden");

    return response.json();
  }
}
