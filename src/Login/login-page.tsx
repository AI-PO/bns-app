// src/app/login/page.tsx
// Drop this file into: src/app/login/page.tsx
// Creates /login route with BNS branding + Google SSO + email/password + wallet option

import { Metadata } from "next";
import { LoginPageClient } from "./LoginPageClient";

export const metadata: Metadata = {
  title: "Sign in — Bitcoin Names",
  description: "Sign in to buy, manage and trade .btc names.",
};

export default function LoginPage() {
  return <LoginPageClient />;
}
