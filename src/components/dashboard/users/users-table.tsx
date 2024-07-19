"use client";
import { DataTable } from "@/components/ui/data-table/data-table";

import LoadingSpinner from "@/components/loading/loading-spinner";

import { type Locale } from "@/navigation";
import { type AllUsers } from "@/server/api/routers/dashboard/users";
import { api } from "@/trpc/react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { type UserTable, getUsersColumns } from "./users-columns";
import UsersCountList from "./users-count-list";

const UsersTable = () => {
  const { data, isLoading } = api.dashboard.users.getAllUsers.useQuery(
    undefined,
    {
      select: useCallback((data: AllUsers) => {
        const formattedUsers = data.users.map((user) => {
          const { createdAt, _count, ...rest } = user;
          const { orders, reviews } = _count;
          return {
            ...rest,
            createdAt,
            orders,
            reviews,
          } as UserTable;
        });
        return {
          ...data,
          users: formattedUsers,
        };
      }, []),
    },
  );
  const locale = useLocale() as Locale;

  const t = useTranslations("dashboard.users.table");
  const Columns = useMemo(() => getUsersColumns(t), [locale]);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <>
      <section className="mb-10 mt-5">
        <UsersCountList
          adminsCount={data?.adminsCount ?? 0}
          customersCount={data?.customersCount ?? 0}
          managersCount={data?.managersCount ?? 0}
          allUsersCount={data?.allUsersCount ?? 0}
        />
      </section>
      <section className="my-5">
        {data && <DataTable columns={Columns} data={data.users} type="users" />}
      </section>
    </>
  );
};

export default UsersTable;
