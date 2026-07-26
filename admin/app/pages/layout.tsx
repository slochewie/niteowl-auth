"use client"

import { StackProvider } from "@btst/stack/context"
import { QueryClientProvider } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { getOrCreateQueryClient } from "@/lib/query-client"

function getBaseURL() {
	if (typeof window !== "undefined") {
		return window.location.origin
	}

	if (typeof process !== "undefined") {
		return process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "http://localhost:3000"
	}

	return "http://localhost:3000"
}

export default function BtstPagesLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const router = useRouter()
	const queryClient = getOrCreateQueryClient()
	const baseURL = getBaseURL()
	return (
		<QueryClientProvider client={queryClient}>
			<StackProvider
				basePath="/pages"
				overrides={
					{
					auth: {
						authClient,
						navigate: (path: string) => router.push(path),
						replace: (path: string) => router.replace(path),
						onSessionChange: () => router.refresh(),
						Link: ({ href, ...props }: any) => <Link href={href || "#"} {...props} />,
						basePath: "/pages/auth",
						redirectTo: "/pages/account/settings",
					},
					account: {
						authClient,
						navigate: (path: string) => router.push(path),
						replace: (path: string) => router.replace(path),
						onSessionChange: () => router.refresh(),
						Link: ({ href, ...props }: any) => <Link href={href || "#"} {...props} />,
						basePath: "/pages/account",
						account: { fields: ["image", "name"] },
					},
					organization: {
						authClient,
						navigate: (path: string) => router.push(path),
						replace: (path: string) => router.replace(path),
						onSessionChange: () => router.refresh(),
						Link: ({ href, ...props }: any) => <Link href={href || "#"} {...props} />,
						basePath: "/pages/org",
						organization: { basePath: "/pages/org" },
					},
					}
				}
			>
				{children}
			</StackProvider>
		</QueryClientProvider>
	)
}
