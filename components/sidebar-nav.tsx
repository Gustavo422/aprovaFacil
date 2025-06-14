"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { LayoutDashboard, FileText, ListChecks, Calendar, Map, Layers, BookOpen, Settings } from "lucide-react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  // Map string icon names to Lucide components
  const iconMap: Record<string, LucideIcon> = {
    LayoutDashboard,
    FileText,
    ListChecks,
    Calendar,
    Map,
    Layers,
    BookOpen,
    Settings,
  }

  return (
    <nav className={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)} {...props}>
      {items.map((item) => {
        const Icon = iconMap[item.icon]
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              isActive 
                ? "bg-muted hover:bg-muted text-foreground" 
                : "hover:bg-transparent hover:underline text-muted-foreground hover:text-foreground",
              "justify-start h-auto py-3 px-3 text-lg font-bold",
              "transition-colors duration-200",
              "flex items-center gap-3"
            )}
          >
            {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
