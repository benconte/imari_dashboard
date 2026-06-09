"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVirtualCards, freezeVirtualCard, unfreezeVirtualCard } from "@/services";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";

const STATUS_BADGE: Record<string, "success" | "danger"> = { Active: "success", Frozen: "danger" };

function CardActions({ id, status }: { id: string; status: string }) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["virtualCards"] });

  const { mutate: doFreeze, isPending: freezing, error: freezeErr } = useMutation({
    mutationFn: () => freezeVirtualCard(id),
    onSuccess: invalidate,
  });
  const { mutate: doUnfreeze, isPending: unfreezing, error: unfreezeErr } = useMutation({
    mutationFn: () => unfreezeVirtualCard(id),
    onSuccess: invalidate,
  });

  const isFrozen = status === "Frozen";
  const pending = freezing || unfreezing;
  const err = (freezeErr ?? unfreezeErr) as Error | null;

  return (
    <div className="pt-3 border-t border-gray-100 mt-2">
      <button
        disabled={pending}
        onClick={() => isFrozen ? doUnfreeze() : doFreeze()}
        className={`w-full text-xs font-bold py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed
          ${isFrozen
            ? "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"
            : "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"}`}
      >
        {pending
          ? (isFrozen ? "Activating…" : "Freezing…")
          : (isFrozen ? "Unfreeze Card" : "Freeze Card")}
      </button>
      {err && <p className="text-[10px] text-red-600 mt-1 text-center">{err.message}</p>}
    </div>
  );
}

export default function VirtualCardsPage() {
  const { data: cards = [], isLoading } = useQuery({ queryKey: ["virtualCards"], queryFn: getVirtualCards });
  const totalSpentToday = cards.reduce((s, c) => s + c.spentTodayValue, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Virtual Cards" subtitle="Card status, limits & activity" action={<Button variant="outline" size="sm" icon="download">Export</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Cards</p><p className="text-3xl font-bold text-gray-900 mt-2">{cards.length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active</p><p className="text-3xl font-bold text-green-600 mt-2">{cards.filter((c) => c.status === "Active").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Frozen</p><p className="text-3xl font-bold text-red-600 mt-2">{cards.filter((c) => c.status === "Frozen").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Spend Today</p><p className="text-3xl font-bold text-blue-600 mt-2">${(totalSpentToday / 1000).toFixed(1)}k</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-sm text-gray-400 col-span-full text-center py-8">Loading cards...</p>
        ) : cards.map((card) => (
          <Card key={card.id} padded className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[20px]">credit_card</span>
                <span className="text-xs font-bold text-gray-400 font-mono">{card.id}</span>
              </div>
              <Badge variant={STATUS_BADGE[card.status] ?? "neutral"}>{card.status}</Badge>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 mb-4 text-white">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-bold opacity-60">{card.type}</span>
                <span className="text-[10px] font-bold opacity-60">{card.currency}</span>
              </div>
              <p className="font-mono text-sm font-bold tracking-widest mb-3">{card.maskedNumber}</p>
              <div className="flex justify-between items-end">
                <div><p className="text-[9px] opacity-50 uppercase">Expires</p><p className="font-mono text-xs">{card.expiry}</p></div>
                <div className="text-right"><p className="text-[9px] opacity-50 uppercase">Holder</p><p className="text-xs font-semibold">{card.cardHolder}</p></div>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex justify-between py-1.5 border-b border-gray-50"><span className="text-[10px] font-bold text-gray-400 uppercase">Daily Limit</span><span className="text-xs font-bold text-gray-900">{card.dailyLimit}</span></div>
              <div className="flex justify-between py-1.5 border-b border-gray-50"><span className="text-[10px] font-bold text-gray-400 uppercase">Spent Today</span><span className="text-xs font-bold text-blue-600">{card.spentToday}</span></div>
              <div className="flex justify-between py-1.5"><span className="text-[10px] font-bold text-gray-400 uppercase">Issued</span><span className="text-xs text-gray-500">{card.issuedDate}</span></div>
            </div>
            <CardActions id={card.id} status={card.status} />
          </Card>
        ))}
      </div>
    </div>
  );
}
