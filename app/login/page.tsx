"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ArrowLeft, Github, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleGithubLogin = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  const isLoading = status === "loading" || status === "authenticated";

  return (
    <div className="relative min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-900 hover:text-white sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-3xl">🍅</span>
            </div>
          </div>
          <CardTitle className="text-3xl">Pomodoro Focus</CardTitle>
          <p className="text-gray-400 mt-2">
            Deep work timer with Google account sync
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2"
            size="lg"
            disabled={isLoading}
          >
            <Mail className="w-5 h-5" />
            Continue with Google
          </Button>
          <Button
            onClick={handleGithubLogin}
            variant="secondary"
            className="w-full flex items-center justify-center gap-2"
            size="lg"
            disabled={isLoading}
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </Button>
          <p className="text-sm text-gray-500 text-center">
            {isLoading
              ? "Checking your session..."
              : "Use Google or GitHub to start your focus session."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
