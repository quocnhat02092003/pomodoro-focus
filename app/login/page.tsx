"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Music } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const handleSpotifyLogin = () => {
    signIn("spotify", { callbackUrl: "/dashboard" });
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const isLoading = status === "loading" || status === "authenticated";

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-3xl">🍅</span>
            </div>
          </div>
          <CardTitle className="text-3xl">Pomodoro Focus</CardTitle>
          <p className="text-gray-400 mt-2">
            Deep work timer with Spotify integration
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleSpotifyLogin}
            className="w-full flex items-center justify-center gap-2"
            size="lg"
            disabled={isLoading}
          >
            <Music className="w-5 h-5" />
            Sign in with Spotify
          </Button>
          <Button
            onClick={handleGoogleLogin}
            variant="secondary"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            Sign in with Google
          </Button>
          <p className="text-sm text-gray-500 text-center">
            {isLoading
              ? "Checking your session..."
              : "Choose a provider to start your focus session."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
