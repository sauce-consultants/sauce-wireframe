import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm border-4 border-black bg-white p-8 shadow-lg text-center">
        <h1 className="text-2xl font-black mb-1">Kitchen Planner</h1>
        <p className="text-sm text-text-muted mb-8">Sign in to continue</p>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/the-pass" });
          }}
        >
          <Button type="submit" className="w-full">
            Sign in with Google
          </Button>
        </form>

        <p className="text-xs text-text-muted mt-6">
          Restricted to @wearesauce.io accounts.
        </p>
      </div>
    </div>
  );
}
