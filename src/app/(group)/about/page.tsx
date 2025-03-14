
export default function About() {
    const data = Array.from({ length: 10 }, (_, index) => ({
      title: `Title ${index + 1}`,
    }));
  return (
    <div className="flex items-start justify-center font-[family-name:var(--font-geist-sans)]">
      <div>
        <h1>About Page</h1>

        {data.map((item, index) => (
            <p key={index}>{item.title}</p>
          ))}
      </div>
    </div>
  );
}
