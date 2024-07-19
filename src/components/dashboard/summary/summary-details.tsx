"use client";
import SkeltonSummaryCard from "@/components/loading/skelton-summary-card";
import { api } from "@/trpc/react";
import SummaryCardList from "./summary-card-list";
import Transactions from "./transactions";

const SummaryDetails = () => {
  const { data, isLoading } = api.dashboard.getDashboardSummary.useQuery();

  return (
    <div className="space-y-4 md:space-y-8">
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <SkeltonSummaryCard key={idx} />
          ))}
        </div>
      )}
      {data && <SummaryCardList summary={data} />}
      <Transactions />
    </div>
  );
};

export default SummaryDetails;
