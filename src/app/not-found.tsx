"use client";
export default function NotFound() {
  return (
    <div
      id="not-found"
      className="flex flex-col items-center justify-center h-full font-[family-name:var(--font-geist-sans)]"
    >
      <h1>404</h1>
      <p className="text-gray-500">Page not found.</p>

      <button
        className="bg-blue-500 text-white p-2 rounded mt-4"
        onClick={() => window.history.back()}
      >
        Go Back
      </button>
    </div>
  );
}
