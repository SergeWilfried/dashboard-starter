import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/transaction-tables/columns";
import { TransactionTable } from "@/components/tables/transaction-tables/transaction-table";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Transaction } from "@/constants/data";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

const breadcrumbItems = [{ title: "Transaction", link: "/dashboard/transaction" }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const country = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  const res = await fetch(
    `https://api.slingacademy.com/v1/sample-data/users?offset=${offset}&limit=${pageLimit}` +
      (country ? `&search=${country}` : ""),
  );
  const transactionRes = await res.json();
  const totalUsers = transactionRes.total_users; //1000
  const pageCount = Math.ceil(totalUsers / pageLimit);
  const transaction: Transaction[] = transactionRes.users;
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Transaction (${totalUsers})`}
            description="Manage transactions (Server side table functionalities.)"
          />

          <Link
            href={"/dashboard/transaction/new"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />

        <TransactionTable
          searchKey="country"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          data={transaction}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}
