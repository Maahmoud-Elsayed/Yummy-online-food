import { FaUserTie, FaUsers } from "react-icons/fa";
import { FaUserGear } from "react-icons/fa6";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import SummaryCard from "../summary/summary-card";
import { useTranslations } from "next-intl";

type UsersCountListProps = {
  customersCount: number;
  adminsCount: number;
  managersCount: number;
  allUsersCount: number;
};
const UsersCountList = ({
  customersCount,
  adminsCount,
  managersCount,
  allUsersCount,
}: UsersCountListProps) => {
  const t = useTranslations("dashboard.users");
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      <SummaryCard
        title={t("total")}
        icon={<FaUsers className="h-5 w-5 text-muted-foreground" />}
      >
        <div className="text-2xl font-bold">+{allUsersCount}</div>
      </SummaryCard>
      <SummaryCard
        title={t("customers")}
        icon={<FaUserTie className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-2xl font-bold">+{customersCount}</div>
      </SummaryCard>
      <SummaryCard
        title={t("admins")}
        icon={
          <MdOutlineAdminPanelSettings className="h-5 w-5 text-muted-foreground" />
        }
      >
        <div className="text-2xl font-bold">+{adminsCount}</div>
      </SummaryCard>
      <SummaryCard
        title={t("managers")}
        icon={<FaUserGear className="h-5 w-5 text-muted-foreground" />}
      >
        <div className="text-2xl font-bold">+{managersCount}</div>
      </SummaryCard>
    </div>
  );
};

export default UsersCountList;
