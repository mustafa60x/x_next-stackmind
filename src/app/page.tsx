

export default async function Home() {
  const dataFetch = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await dataFetch.json() as { title: string }[];

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
