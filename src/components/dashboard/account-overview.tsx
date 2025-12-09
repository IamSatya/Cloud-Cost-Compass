"use client"

import type { AccountCost } from "@/lib/types";
import Link from "next/link";
import { collection } from "firebase/firestore";
import { useCollection, useUser, useFirestore, useMemoFirebase } from "@/firebase";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AccountOverview() {
  const { user } = useUser();
  const firestore = useFirestore();

  const accountsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/awsAccounts`);
  }, [user, firestore]);

  const { data: accounts, isLoading } = useCollection<Omit<AccountCost, 'cost'>>(accountsQuery);

  const accountData: AccountCost[] | undefined = accounts?.map(acc => ({
    ...acc,
    cost: Math.random() * 1000 // Placeholder cost
  })).sort((a,b) => b.cost - a.cost);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Overview</CardTitle>
        <CardDescription>Cost breakdown by AWS account. Click an account for details.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-5 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            {accountData?.map((account) => (
              <TableRow key={account.accountId} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <Link href={`/accounts/${account.id}`} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{account.accountName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{account.accountName}</div>
                      <div className="text-sm text-muted-foreground">{account.accountId}</div>
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="text-right font-medium">
                  <Link href={`/accounts/${account.id}`} className="block">
                    ${account.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
             {!isLoading && (!accountData || accountData.length === 0) && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  No accounts found. Add one in Settings.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
