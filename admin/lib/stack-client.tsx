import { createStackClient } from "@btst/stack/client"
import { QueryClient } from "@tanstack/react-query"
import { authClientPlugin, accountClientPlugin, organizationClientPlugin } from "@btst/better-auth-ui/client"

export function getStackClient(queryClient: QueryClient) {
	const baseURL = getBaseURL()
	return createStackClient({
		plugins: {
			auth: authClientPlugin({
				siteBaseURL: baseURL,
				siteBasePath: "/pages",
			}),
			account: accountClientPlugin({
				siteBaseURL: baseURL,
				siteBasePath: "/pages",
			}),
			organization: organizationClientPlugin({
				siteBaseURL: baseURL,
				siteBasePath: "/pages",
			}),
		},
	})
}
function getBaseURL() {
	if (typeof window !== "undefined") {
		return window.location.origin
	}

	// Use literal process.env.XXX so bundlers (Vite define, Next.js, etc.)
	// can statically replace these at build/transform time.
	if (process.env.BTST_SITE_URL) return process.env.BTST_SITE_URL
	if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
	if (process.env.BASE_URL) return process.env.BASE_URL
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

	return "http://localhost:3000"
}
