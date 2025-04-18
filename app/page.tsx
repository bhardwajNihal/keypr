// app/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main>
      {/* Your landing page content here */}
      <h1>Welcome to Keypr 🔐</h1>
      <p>Your all-in-one secure password vault</p>
    </main>
  );
}
