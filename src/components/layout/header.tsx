"use client";

import type { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
} from "lucide-react";
import type { AwsCostData } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppSidebar from "./sidebar";
import Logo from "../logo";

interface AppHeaderProps {
  timePeriod: keyof AwsCostData;
  setTimePeriod: Dispatch<SetStateAction<keyof AwsCostData>>;
}

export default function AppHeader({ timePeriod, setTimePeriod }: AppHeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <div className="p-2 border-b">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo />
              <span>CloudCost Compass</span>
            </Link>
          </div>
          <AppSidebar isMobile={true} />
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        <Tabs value={timePeriod} onValueChange={(value) => setTimePeriod(value as keyof AwsCostData)}>
          <TabsList className="grid w-full max-w-sm grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <span className="text-xs">A</span>
            </div>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
