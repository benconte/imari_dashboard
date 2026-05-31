"use client";

import React from 'react';
import { Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';

export type VirtualCardStatus = 'Active' | 'Frozen';
export type VirtualCardType = 'Single-use' | 'Recurring';

export interface VirtualCardItem {
  id: string;
  name: string;
  number: string;
  expiry: string;
  cvv: string;
  limit: number;
  spent: number;
  status: VirtualCardStatus;
  type: VirtualCardType;
  merchant?: string;
}

interface VirtualCardCardProps {
  card: VirtualCardItem;
  isFullShown: boolean;
  onToggleReveal: (id: string) => void;
  onToggleFreeze: (id: string) => void;
  onOpenInspector: (id: string) => void;
}

export const VirtualCardCard: React.FC<VirtualCardCardProps> = ({
  card,
  isFullShown,
  onToggleReveal,
  onToggleFreeze,
  onOpenInspector
}) => {
  const spendPercent = Math.min(100, Math.round((card.spent / card.limit) * 100));

  return (
    <div
      key={card.id}
      onClick={() => onOpenInspector(card.id)}
      className={`bg-white rounded-2xl border ${
        card.status === 'Frozen' ? 'border-dashed border-gray-200 opacity-75' : 'border-gray-100'
      } shadow-sm p-6 hover:shadow-md cursor-pointer hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between space-y-6`}
    >
      {/* Card Meta Header */}
        <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-bold text-gray-900 leading-tight">{card.name}</h4>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
              {card.type}
            </span>
            {card.merchant && <span className="text-[10px] font-bold text-indigo-500">Locked: {card.merchant}</span>}
          </div>
        </div>
        <StatusBadge status={card.status === 'Frozen' ? 'frozen' : 'active'} />
      </div>

      {/* Physical/Digital Card Render */}
      <div
        className={`relative p-5 rounded-2xl bg-gradient-to-tr ${
          card.status === 'Frozen'
            ? 'from-gray-700 to-gray-800'
            : card.type === 'Single-use'
            ? 'from-indigo-900 to-slate-900 shadow-md shadow-indigo-950/20'
            : 'from-blue-600 to-indigo-800 shadow-md shadow-indigo-900/10'
        } text-white font-mono`}
      >
        <div className="flex justify-between items-start mb-6">
          <span className="text-xs font-semibold tracking-widest text-indigo-200 uppercase">Imari Commercial</span>
          <div className="w-10 h-7 bg-white/10 rounded-md backdrop-blur-sm border border-white/10 flex items-center justify-center p-1">
            <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-sm" />
          </div>
        </div>

        <div className="text-lg md:text-xl font-bold tracking-[0.2em] mb-4">
          {isFullShown ? `4111 2222 3333 ${card.cvv}` : card.number}
        </div>

        <div className="flex justify-between items-end text-[10px] text-white/70">
          <div>
            <span className="block text-[8px] uppercase text-white/50 mb-0.5">Cardholder</span>
            <span className="font-semibold tracking-wider text-white">IMARI ADMINISTRATIVE</span>
          </div>
          <div>
            <span className="block text-[8px] uppercase text-white/50 mb-0.5">Expires</span>
            <span className="font-semibold tracking-wider text-white">{card.expiry}</span>
          </div>
          <div>
            <span className="block text-[8px] uppercase text-white/50 mb-0.5">CVV</span>
            <span className="font-semibold tracking-wider text-white">{isFullShown ? card.cvv : '•••'}</span>
          </div>
        </div>
      </div>

      {/* Progress and Spending bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="font-bold text-gray-500">Spent on Card</span>
          <span className="font-mono font-bold text-gray-900">
            ${card.spent.toLocaleString()} / <span className="text-gray-400">${card.limit.toLocaleString()}</span>
          </span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-350 ${
              card.status === 'Frozen' ? 'bg-gray-400' : spendPercent > 80 ? 'bg-rose-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${spendPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
          <span>Usage: {spendPercent}%</span>
          <span>{spendPercent > 80 ? 'Approaching Limit' : 'Compliant'}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleReveal(card.id);
          }}
          className="flex-1 flex items-center justify-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold py-2 rounded-xl transition-all"
        >
          {isFullShown ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              Hide Credentials
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              Reveal Card No.
            </>
          )}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFreeze(card.id);
          }}
          className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold rounded-xl transition-all ${
            card.status === 'Frozen'
              ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
              : 'bg-rose-50 hover:bg-rose-100 text-rose-600'
          }`}
        >
          {card.status === 'Frozen' ? (
            <>
              <Unlock className="w-3.5 h-3.5" />
              Unfreeze Card
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" />
              Freeze Card
            </>
          )}
        </button>
      </div>
    </div>
  );
};

