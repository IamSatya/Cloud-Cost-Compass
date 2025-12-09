"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BarChart3,
  Settings,
  LifeBuoy,
} from "lucide-react";
import Logo from "../logo";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";

interface AppSidebarProps {
  isMobile?: boolean;
}

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "#", label: "Reports", icon: BarChart3 },
  { href: "#", label: "Settings", icon: Settings },
  { href: "#", label: "Support", icon: LifeBuoy },
];

export default function AppSidebar({ isMobile = false }: AppSidebarProps) {
  const pathname = usePathname();

  const mainNav = (
    <nav className={cn("grid items-start px-2 text-sm font-medium lg:px-4", isMobile && "px-4")}>
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            pathname === href && "bg-muted text-primary"
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );

  if (isMobile) {
    return <div className="flex-1 overflow-auto py-2">{mainNav}</div>;
  }

  return (
    <div className="hidden border-r bg-card lg:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo />
            <span className="">CloudCost Compass</span>
          </Link>
        </div>
        <div className="flex-1">
          {mainNav}
        </div>
        <div className="mt-auto p-4">
          <Card>
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                Contact our support team for any questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
