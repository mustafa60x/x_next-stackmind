"use client";

import {useState, useEffect} from "react";

export default function Home() {
  const [data, setData] = useState<{ title: string }[]>([]);

  useEffect(() => {
    async function fetchData() {
      fetch('https://jsonplaceholder.typicode.com/todos').then(response => response.json()).then(data => setData(data));
    }

    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div>
        Merhaba
        {data.map((item, index) => (
          <p key={index}>{item.title}</p>
        ))}
      </div>
    </div>
  );
}
