import LoginForm from "../components/LoginForm";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-green-900 to-black">
      <main className="w-full max-w-md px-6">
        <LoginForm />
      </main>
    </div>
  );
}
