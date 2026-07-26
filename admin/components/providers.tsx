"use client"

import { AuthUIProvider } from "@btst/better-auth-ui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

import { authClient } from "@/lib/auth-client"

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => router.refresh()}
      Link={Link}
      basePath="/pages/auth"
      redirectTo="/pages/account/settings"
      account={{ basePath: "/pages/account", fields: ["image", "name"] }}
      organization={{ basePath: "/pages/org" }}
    >
      {children}
    </AuthUIProvider>
  )
}
