import { useAuthStore } from "@/stores";

export class BaseRepository {
  protected async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    if (response.ok) {
      return response.json();
    }

    // Error handling
    if (response?.status === 401) {
      // Unauthorized - Token'ı temizle
      useAuthStore.setState({ token: null });
      // Oturum açma sayfasına yönlendir
      window.location.href = "/login";
    }
    // 403
    if (response.status === 403) throw new Error("Forbidden");

    return response.json();
  }
}
