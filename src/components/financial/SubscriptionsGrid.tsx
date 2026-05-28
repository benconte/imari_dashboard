"use client";

import React, { useMemo, useState } from 'react';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  RefreshCw,
  Calendar,
  Tag,
  Plus,
} from 'lucide-react';

interface SubModel {
  id: string;
  name: string;
  category: 'Infrastructure' | 'Marketing' | 'SaaS License' | 'Design Tools';
  cost: number;
  frequency: 'Monthly' | 'Annual';
  nextBilling: string;
  status: 'Active' | 'Paused' | 'Pending Cancel';
  owner: string;
}

export type SubCategory = SubModel['category'];

const initialSubs: SubModel[] = [
  {
    id: 'sub-1',
    name: 'AWS Cloud Engine Ingress',
    category: 'Infrastructure',
    cost: 18450.0,
    frequency: 'Monthly',
    nextBilling: 'Jun 12, 2026',
    status: 'Active',
    owner: 'Alex Rivera',
  },
  {
    id: 'sub-2',
    name: 'Google Ads PPC Suite',
    category: 'Marketing',
    cost: 12000.0,
    frequency: 'Monthly',
    nextBilling: 'Jun 18, 2026',
    status: 'Active',
    owner: 'Sarah Jenkins',
  },
  {
    id: 'sub-3',
    name: 'Figma Enterprise Growth Plan',
    category: 'Design Tools',
    cost: 1200.0,
    frequency: 'Annual',
    nextBilling: 'Sep 01, 2026',
    status: 'Active',
    owner: 'Elena Chen',
  },
  {
    id: 'sub-4',
    name: 'Salesforce CRM Pipeline',
    category: 'SaaS License',
    cost: 4500.0,
    frequency: 'Monthly',
    nextBilling: 'Jun 04, 2026',
    status: 'Paused',
    owner: 'John Sterling',
  },
];

export function SubscriptionsGrid({
  className,
  showTopStats = true,
  variant = 'default',
}: {
  className?: string;
  showTopStats?: boolean;
  variant?: 'default' | 'txid';
}) {
  const [subs, setSubs] = useState<SubModel[]>(initialSubs);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCategory, setNewSubCategory] = useState<SubCategory>('Infrastructure');
  const [newSubCost, setNewSubCost] = useState('1000');

  const activeCost = useMemo(
    () => subs.filter((s) => s.status === 'Active').reduce((sum, s) => sum + s.cost, 0),
    [subs],
  );

  const handleToggleSub = (id: string) => {
    setSubs((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return {
          ...s,
          status: s.status === 'Active' ? 'Paused' : 'Active',
        };
      }),
    );
  };

  const handleAddNewSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    const newS: SubModel = {
      id: `sub-${Date.now()}`,
      name: newSubName,
      category: newSubCategory,
      cost: parseFloat(newSubCost) || 500,
      frequency: 'Monthly',
      nextBilling: 'Jun 20, 2026',
      status: 'Active',
      owner: 'Alex Rivera',
    };

    setSubs((prev) => [newS, ...prev]);
    setNewSubName('');
    setNewSubCost('1000');
    setIsAddingNew(false);
  };

  return (
    <div className={className}>
      {showTopStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard
            title="ACTIVE RECURRING COST"
            value={`$${activeCost.toLocaleString('en-US')}/mo`}
            subtitle="Enterprise SaaS, Server and Ads spending"
            icon={<RefreshCw />}
            iconBgClass="bg-indigo-50 text-indigo-600"
          />
          <StatCard
            title="TOTAL SUBSCRIPTIONS"
            value={String(subs.length)}
            subtitle={`${subs.filter((s) => s.status === 'Active').length} currently active`}
            icon={<Tag />}
            iconBgClass="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            title="NEXT MAJOR PAYMENT EXECUTING"
            value="In 9 Days"
            subtitle="AWS Invoice due ($18,450.00)"
            icon={<Calendar />}
            iconBgClass="bg-indigo-50 text-indigo-600"
          />
        </div>
      )}

      {!isAddingNew ? (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-xl text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Subscription
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleAddNewSub}
          className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-4 items-end animate-fade-in mb-6"
        >
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Subscription Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AWS Production Billing"
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-indigo-100 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={newSubCategory}
              onChange={(e) => setNewSubCategory(e.target.value as SubCategory)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-indigo-100 focus:bg-white appearance-none h-9 inline-flex items-center font-semibold text-gray-700 font-sans"
            >
              <option value="Infrastructure">Infrastructure</option>
              <option value="Marketing">Marketing</option>
              <option value="SaaS License">SaaS License</option>
              <option value="Design Tools">Design Tools</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Monthly Cost ($)
            </label>
            <input
              type="number"
              required
              value={newSubCost}
              onChange={(e) => setNewSubCost(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-indigo-100 focus:bg-white"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700"
            >
              Add Contract
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subs.map((s) => (
          <div
            key={s.id}
            className={`bg-white rounded-2xl border ${
              s.status === 'Paused' ? 'border-dashed border-gray-200 opacity-75' : 'border-gray-105'
            } p-6 h-full flex flex-col justify-between space-y-5 hover:shadow-md transition-all duration-200`}
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50/50 border border-indigo-100/30 px-2 py-0.5 rounded">
                {s.category}
              </span>
              <StatusBadge status={s.status} />
            </div>

            <div>
              <h4 className="font-bold text-gray-950 font-sans leading-snug">{s.name}</h4>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-2xl font-bold font-mono text-gray-900">
                  ${s.cost.toLocaleString('en', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] font-bold text-gray-400 lowercase uppercase">/{s.frequency}</span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-100/50 rounded-xl space-y-1 text-[10px] leading-normal font-sans">
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold">NEXT PAYABLE</span>
                <span className="font-mono text-gray-700 font-bold">{s.nextBilling}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold">CONTROLLER</span>
                <span className="text-gray-600 font-bold truncate max-w-[120px]">{s.owner}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-50 flex gap-2">
              <button
                type="button"
                onClick={() => handleToggleSub(s.id)}
                className={`w-full py-2 rounded-xl text-xs font-bold text-center transition-colors ${
                  s.status === 'Paused'
                    ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                }`}
              >
                {s.status === 'Paused' ? 'Resume Billing' : 'Pause Contract'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

