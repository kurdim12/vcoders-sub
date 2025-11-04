"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getAllAccounts,
  getCurrentAccountId,
  setCurrentAccountId,
  getAccount,
  getAccountDisplayName,
  type DemoAccount,
} from "@/lib/accounts";
import { useStore } from "@/lib/store";
import { User, Check, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function AccountSwitcher() {
  const router = useRouter();
  const [currentAccountId, setCurrentAccountIdState] = useState<string>(getCurrentAccountId());
  const [switching, setSwitching] = useState(false);
  const accounts = getAllAccounts();
  const currentAccount = getAccount(currentAccountId);
  const store = useStore();

  // Listen for storage changes (account switching in other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentAccountIdState(getCurrentAccountId());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSwitchAccount = async (newAccountId: string) => {
    if (switching || newAccountId === currentAccountId) return;

    setSwitching(true);

    try {
      // Switch account in store
      await store.switchAccount(newAccountId);
      
      // Set as current account
      setCurrentAccountId(newAccountId);
      setCurrentAccountIdState(newAccountId);
      
      // Wait for store to update
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Redirect to courses
      const courses = store.courses;
      if (courses.length > 0) {
        router.push(`/courses/${courses[0].id}`);
      } else {
        router.push("/courses");
      }
    } catch (error) {
      console.error("Failed to switch account:", error);
    } finally {
      setSwitching(false);
    }
  };

  const handleSignOut = () => {
    router.push("/auth/select-account");
  };

  if (!currentAccount) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 h-auto py-2 px-3">
          <div className="text-xl">{currentAccount.avatar}</div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium leading-none">
              {currentAccount.name}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {currentAccount.major}
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Demo Accounts</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {accounts.map((account) => {
          const isCurrent = account.id === currentAccountId;
          return (
            <DropdownMenuItem
              key={account.id}
              onClick={() => handleSwitchAccount(account.id)}
              disabled={switching || isCurrent}
              className={cn(
                "cursor-pointer",
                isCurrent && "bg-accent"
              )}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="text-2xl">{account.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">
                      {account.name}
                    </span>
                    {isCurrent && (
                      <Check className="w-3 h-3 text-primary shrink-0" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {account.major}
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Switch Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

