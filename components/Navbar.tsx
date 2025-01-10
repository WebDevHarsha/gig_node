"use client"

interface EthereumRequest {
  method: string;
  params?: unknown[];
}

interface WindowWithEthereum {
  ethereum?: {
    request: (args: EthereumRequest) => Promise<unknown>;
    on: (event: string, handler: (...args: any[]) => void) => void;
    removeListener: (event: string, handler: (...args: any[]) => void) => void;
  };
}

declare global {
  interface Window extends WindowWithEthereum {}
}

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from 'lucide-react'
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { useState, useEffect, useCallback } from 'react'

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
      className={`z-50 min-w-[8rem] bg-white overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${className}`}
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
    className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${inset && "pl-8"} ${className}`}
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
  const [walletAddress, setWalletAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState("")
  const [balance, setBalance] = useState("")
  const [chainId, setChainId] = useState("")

  const updateWalletInfo = useCallback(async (address: string) => {
    try {
      if (!window.ethereum) {
        throw new Error("Ethereum object not found");
      }
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      }) as string
      
      const ethBalance = parseInt(balance) / 1e18
      setBalance(ethBalance.toFixed(4))

      const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string
      setChainId(chainId)
    } catch (err) {
      console.error("Error updating wallet info:", err)
    }
  }, [])

  const handleChainChanged = useCallback(async (newChain: string) => {
    setChainId(newChain)
    if (walletAddress) {
      await updateWalletInfo(walletAddress)
    }
  }, [walletAddress, updateWalletInfo])

  const checkWalletConnection = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[]
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          await updateWalletInfo(accounts[0])
        }
      } catch (err) {
        console.error("Error checking wallet connection:", err)
      }
    }
  }, [updateWalletInfo])

  useEffect(() => {
    checkWalletConnection()
    
    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged)
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [checkWalletConnection, handleChainChanged])

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      setError("Please install MetaMask to connect your wallet")
      return
    }

    try {
      setIsConnecting(true)
      setError("")
      
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      }) as string[]
      
      const address = accounts[0]
      setWalletAddress(address)
      await updateWalletInfo(address)

      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setWalletAddress("")
          setBalance("")
          setChainId("")
        } else {
          setWalletAddress(accounts[0])
          updateWalletInfo(accounts[0])
        }
      })

    } catch (err) {
      console.error(err)
      setError("Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWalletAddress("")
    setBalance("")
    setChainId("")
  }

  const formatAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getNetworkName = (chainId: string) => {
    switch (chainId) {
      case "0x1":
        return "Ethereum"
      case "0x89":
        return "Polygon"
      case "0x38":
        return "BSC"
      default:
        return "Unknown Network"
    }
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
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {walletAddress && (
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span>{getNetworkName(chainId)}</span>
              {balance && <span>• {balance} ETH</span>}
            </div>
          )}
          
          <Button
            variant={walletAddress ? "outline" : "default"}
            onClick={walletAddress ? disconnectWallet : connectWallet}
            className="hidden sm:inline-flex items-center space-x-2"
            disabled={isConnecting}
          >
            <span>
              {isConnecting 
                ? "Connecting..." 
                : walletAddress 
                  ? formatAddress(walletAddress) 
                  : "Connect Wallet"}
            </span>
          </Button>
          
          {error && (
            <span className="text-red-500 text-sm">{error}</span>
          )}

          <Link href="/signup">
            <button
              type="button"
              className="text-blue-900 bg-white border border-blue-300 focus:outline-none hover:bg-blue-100 focus:ring-4 focus:ring-blue-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-800 dark:text-white dark:border-blue-600 dark:hover:bg-blue-700 dark:hover:border-blue-600 dark:focus:ring-blue-700"
            >
              Signup/Login
            </button>
          </Link>

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
              <DropdownMenuItem 
                onClick={walletAddress ? disconnectWallet : connectWallet}
              >
                <div className="flex items-center space-x-2">
                  <span>
                    {walletAddress ? "Disconnect Wallet" : "Connect Wallet"}
                  </span>
                </div>
              </DropdownMenuItem>
              {walletAddress && (
                <DropdownMenuItem className="flex flex-col items-start">
                  <span className="text-sm text-gray-600">
                    {getNetworkName(chainId)}
                  </span>
                  {balance && (
                    <span className="text-sm text-gray-600">
                      {balance} ETH
                    </span>
                  )}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}