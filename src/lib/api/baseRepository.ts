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

    const data = await response.json();

    if (response.ok) {
      return data;
    }

    // Error handling
    if (response?.status === 401) {
      // Unauthorized - Token'ı temizle
      Cookies.remove("access_token");
      // Oturum açma sayfasına yönlendir
      // if pathname is not login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      throw new Error(data.message || "Oturum açmanız gerekiyor");
    }
    // 403
    if (response.status === 403) throw new Error(data.message || "İzin Yetersiz");

    return response.json();
  }
}
