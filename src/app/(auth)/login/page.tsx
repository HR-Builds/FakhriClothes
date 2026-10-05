import LoginForm from "./LoginForm";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    message?: string;
    error?: string;
    verified?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="section-title text-center">Welcome Back</h1>

      <span className="gold-underline mx-auto" />

      <LoginForm
        next={params.next}
        message={params.message}
        error={params.error}
        verified={params.verified}
      />
    </div>
  );
}