import { stack } from "@btst/stack"
import { createMemoryAdapter } from "@btst/adapter-memory"
// Next.js evaluates lib/stack.ts in multiple bundle contexts (API routes + page bundle)
// that share the same process. Pin to globalThis so both contexts reference the same
// in-memory store.
const globalForStack = global as typeof global & { __btst_stack__?: ReturnType<typeof stack> }

function createStack() {
	const s = stack({
		basePath: "/api/data",
		plugins: {
			// Add backend plugins here.
		},
		adapter: (db) => createMemoryAdapter(db)({}),
	})

	return s
}

export const myStack = globalForStack.__btst_stack__ ??= createStack()

export const { handler, dbSchema } = myStack
