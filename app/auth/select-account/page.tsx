"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllAccounts, getCurrentAccountId, setCurrentAccountId, getAccount, type DemoAccount } from "@/lib/accounts";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SelectAccountPage() {
  const router = useRouter();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [switching, setSwitching] = useState(false);
  const accounts = getAllAccounts();
  const currentAccountId = getCurrentAccountId();
  const store = useStore();

  const handleSelectAccount = async (accountId: string) => {
    if (switching || accountId === currentAccountId) return;

    setSwitching(true);
    setSelectedAccountId(accountId);

    try {
      // Switch account in store
      await store.switchAccount(accountId);
      
      // Set as current account
      setCurrentAccountId(accountId);
      
      // Wait a bit for store to update
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Get account info
      const account = getAccount(accountId);
      if (!account) return;

      // Redirect to courses
      const courses = store.courses;
      if (courses.length > 0) {
        router.push(`/courses/${courses[0].id}`);
      } else {
        router.push("/courses");
      }
    } catch (error) {
      console.error("Failed to switch account:", error);
      setSwitching(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Select Demo Account</h1>
          <p className="text-muted-foreground mt-2">Choose a demo account to explore UNI-Agent</p>
        </div>

        {/* Account Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {accounts.map((account) => {
            const isCurrent = account.id === currentAccountId;
            const isSelected = account.id === selectedAccountId;
            const isDisabled = switching && !isSelected;

            return (
              <Card
                key={account.id}
                className={cn(
                  "relative cursor-pointer transition-all hover:shadow-lg",
                  isCurrent && "ring-2 ring-primary",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !isDisabled && handleSelectAccount(account.id)}
              >
                {isCurrent && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground">
                      <Check className="w-3 h-3 mr-1" />
                      Current
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{account.avatar}</div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl">{account.name}</CardTitle>
                      <CardDescription className="mt-1">{account.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Major:</span>
                      <Badge variant="secondary">{account.major}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Year:</span>
                      <span className="font-medium">{account.year}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Study Style:</span>
                      <Badge variant="outline" className="capitalize">
                        {account.preferences.studyStyle}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Best Time:</span>
                      <Badge variant="outline" className="capitalize">
                        {account.preferences.studyTime}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      className="w-full"
                      disabled={isDisabled || isCurrent}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isDisabled && !isCurrent) {
                          handleSelectAccount(account.id);
                        }
                      }}
                    >
                      {switching && isSelected ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Switching...
                        </>
                      ) : isCurrent ? (
                        "Current Account"
                      ) : (
                        "Select Account"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Each account has completely isolated data and different course content
          </p>
        </div>
      </div>
    </div>
  );
}

