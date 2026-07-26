"use client"

import Link from "next/link"
import { MenuIcon } from "lucide-react"
import { SignedIn, SignedOut, UserButton } from "@btst/better-auth-ui"
import { ModeToggle } from "./mode-toggle"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [{ href: "/pages/route-docs", label: "Available Routes" }]

export function Navbar() {
	return (
		<nav className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					<Link href="/" className="text-xl font-bold">
						<span className="text-secondary-foreground">@BTST/STACK</span>
					</Link>

					<div className="hidden md:flex items-center gap-2">
						{navLinks.map((link) => (
							<Button
								key={link.href}
								variant="ghost"
								className="text-secondary-foreground"
								asChild
							>
								<Link href={link.href}>{link.label}</Link>
							</Button>
						))}
						<SignedOut>
							<Button variant="ghost" asChild>
								<Link href="/pages/auth/sign-in">Sign In</Link>
							</Button>
						</SignedOut>
						<SignedIn>
							<UserButton size="icon" />
						</SignedIn>
						<ModeToggle />
					</div>

					<div className="flex md:hidden items-center gap-2">
						<SignedIn>
							<UserButton size="icon" />
						</SignedIn>
						<ModeToggle />
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="icon" className="size-8">
									<MenuIcon className="h-4 w-4" />
									<span className="sr-only">Open menu</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								{navLinks.map((link) => (
									<DropdownMenuItem key={link.href} asChild>
										<Link href={link.href} className="cursor-pointer">
											{link.label}
										</Link>
									</DropdownMenuItem>
								))}
								<SignedOut>
									<DropdownMenuItem asChild>
										<Link href="/pages/auth/sign-in">Sign In</Link>
									</DropdownMenuItem>
								</SignedOut>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</nav>
	)
}
