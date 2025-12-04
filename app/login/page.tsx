"use client";

import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);
    setErrorMessage("");
    setLoading(true);
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log("supabase signIn response:", response);

      if (response.error) {
        setErrorMessage(response.error.message ?? "Login failed");
        console.error(response.error);
      } else {
        const session = (response.data as any)?.session;
        if (session) {
          console.log("Session created, waiting 1.5s for cookies to be set...");
          await new Promise(r => setTimeout(r, 1500)); // Wait for cookies to propagate
          console.log("Redirecting to /admin");
          console.log(session);
          router.push("/admin");
        } else {
          setErrorMessage(
            "Login succeeded but no active session was returned. Check email confirmation or project auth settings."
          );
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMessage((err as Error).message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Login"}
      </button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </form>
  );
}
