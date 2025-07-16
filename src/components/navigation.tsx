"use client"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LuMoon, LuSun, LuUser, LuSettings, LuLogOut, LuCreditCard, LuPlus } from "react-icons/lu";
import { usePathname } from "next/navigation"

interface NavigationProps {
  isLoggedIn?: boolean
  userCredits?: number
}

export function Navigation({ isLoggedIn = false, userCredits = 0 }: NavigationProps) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 mx-auto">
        <div className="mr-4 flex">
          <Link href={isLoggedIn ? "/home" : "/"} className="mr-6 flex items-center space-x-2">
            <div className="h-6 w-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded" />
            <span className="font-bold text-lg">Architer</span>
          </Link>
          {isLoggedIn && (
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/home"
                className={`transition-colors hover:text-foreground/80 ${
                  pathname === "/home" ? "text-foreground" : "text-foreground/60"
                }`}
              >
                Home
              </Link>
              <Link
                href="/interview/create"
                className={`transition-colors hover:text-foreground/80 ${
                  pathname === "/interview/create" ? "text-foreground" : "text-foreground/60"
                }`}
              >
                Create Interview
              </Link>
              <Link
                href="/interviews"
                className={`transition-colors hover:text-foreground/80 ${
                  pathname === "/interviews" ? "text-foreground" : "text-foreground/60"
                }`}
              >
                My Interviews
              </Link>
            </nav>
          )}
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {isLoggedIn && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <LuCreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{userCredits}</span>
                <Badge variant="secondary" className="text-xs">
                  Credits
                </Badge>
              </div>

              <Link href="/interview/create">
                <Button size="sm" className="h-8">
                  <LuPlus className="h-4 w-4 mr-1" />
                  New Interview
                </Button>
              </Link>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <LuSun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <LuMoon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <LuUser className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <LuSettings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/credits">
                      <LuCreditCard className="mr-2 h-4 w-4" />
                      Buy Credits
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/">
                      <LuLogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
