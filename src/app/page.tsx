import Counter from "../components/counter";

export default async function Home() {
  const dataFetch = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await dataFetch.json() as { title: string }[];

  return (
    <div className="flex items-center justify-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div>
        <h1>Merhaba</h1>

        <Counter />


        <div className="mt-4">
          {data.map((item, index) => (
            <p key={index}>{item.title}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
