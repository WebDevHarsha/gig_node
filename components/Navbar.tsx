"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Wallet, Menu, ChevronDown } from 'lucide-react'
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"

// Button Component
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline"
    size?: "default" | "sm" | "lg" | "icon"
  }
>(({ className, variant = "default", size = "default", ...props }, ref) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background
        ${variant === "default" 
          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
          : "border border-input hover:bg-accent hover:text-accent-foreground"}
        ${size === "default" 
          ? "h-10 py-2 px-4" 
          : size === "sm" 
          ? "h-9 px-3 rounded-md" 
          : size === "lg" 
          ? "h-11 px-8 rounded-md" 
          : "h-10 w-10"}
        ${className}`}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

// DropdownMenu Components
const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={`z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${className}`}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${
      inset && "pl-8"
    } ${className}`}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const navItems = [
  { name: "Find Work", href: "/find-work" },
  { name: "Post a Job", href: "/post-job" },
  { name: "Talents", href: "/talents" },
  { name: "About", href: "/about" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isWalletConnected, setIsWalletConnected] = React.useState(false)

  const handleWalletConnection = () => {
    setIsWalletConnected(!isWalletConnected)
  }

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-2xl font-bold">Gig Node</span>
        </Link>
        <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button
            variant={isWalletConnected ? "outline" : "default"}
            onClick={handleWalletConnection}
            className="hidden sm:inline-flex"
          >
            <Wallet className="mr-2 h-4 w-4" />
            {isWalletConnected ? "0x1234...5678" : "Connect Wallet"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {navItems.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <Link href={item.href}>{item.name}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={handleWalletConnection}>
                {isWalletConnected ? "Disconnect Wallet" : "Connect Wallet"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}

