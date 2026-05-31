"use client";

import React, { useState } from 'react';
import { PageWrapper } from '@/components/shared/PageWrapper';
import StatCard from '@/components/shared/StatCard';
import { Plus,  Eye, EyeOff, Lock, Unlock, ChevronLeft, SlidersHorizontal, Activity } from 'lucide-react';

import { VirtualCardCard, VirtualCardItem } from '@/components/virtual-cards/VirtualCardCard';

const initialCards: VirtualCardItem[] = [
  {
    id: 'card-1',
    name: 'AWS Infrastructure Billing',
    number: '•••• •••• •••• 9812',
    expiry: '09/28',
    cvv: '129',
    limit: 20000.0,
    spent: 12450.0,
    status: 'Active',
    type: 'Recurring',
    merchant: 'Amazon Web Services'
  },
  {
    id: 'card-2',
    name: 'Marketing Ad Campaigns',
    number: '•••• •••• •••• 4545',
    expiry: '12/27',
    cvv: '404',
    limit: 50000.0,
    spent: 34100.50,
    status: 'Active',
    type: 'Recurring',
    merchant: 'Google Ads'
  },
  {
    id: 'card-3',
    name: 'Ad-hoc Vendor Purchase',
    number: '•••• •••• •••• 3021',
    expiry: '05/26',
    cvv: '882',
    limit: 1500.0,
    spent: 1450.0,
    status: 'Frozen',
    type: 'Single-use',
    merchant: 'Figma Inc'
  },
  {
    id: 'card-4',
    name: 'Github Team Subscription',
    number: '•••• •••• •••• 1150',
    expiry: '10/29',
    cvv: '312',
    limit: 500.0,
    spent: 420.0,
    status: 'Active',
    type: 'Recurring',
    merchant: 'GitHub'
  }
];

export const VirtualCardsPage: React.FC = () => {
  const [cards, setCards] = useState<VirtualCardItem[]>(initialCards);
  const [showFullNumbers, setShowFullNumbers] = useState<Record<string, boolean>>({});
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [newCardName, setNewCardName] = useState('');
  const [newCardLimit, setNewCardLimit] = useState('1000');
  const [newCardType, setNewCardType] = useState<'Single-use' | 'Recurring'>('Recurring');
  const [newCardMerchant, setNewCardMerchant] = useState('');

  const [authorizedMerchants, setAuthorizedMerchants] = useState<Record<string, Record<string, boolean>>>({
    'card-1': { 'Amazon Web Services': true, 'Google Cloud': true, 'Heroku': false },
    'card-2': { 'Google Ads': true, 'Facebook Ads': true, 'TikTok Ads': false },
    'card-3': { 'Figma Inc': true, 'Adobe': false, 'Canva': false },
    'card-4': { 'GitHub': true, 'Slack': true, 'Zoom': false }
  });

  const handleToggleFreeze = (id: string) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, status: c.status === 'Active' ? 'Frozen' : 'Active' } : c)));
  };

  const handleToggleReveal = (id: string) => {
    setShowFullNumbers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardName.trim()) return;

    const newId = `card-${Date.now()}`;
    const newCard: VirtualCardItem = {
      id: newId,
      name: newCardName,
      number: showFullNumbers[newCardName] ? '4111 2222 3333 ' + Math.floor(1000 + Math.random() * 9000) : '•••• •••• •••• ' + Math.floor(1000 + Math.random() * 9000),
      expiry: '06/31',
      cvv: String(Math.floor(100 + Math.random() * 900)),
      limit: parseFloat(newCardLimit) || 1000,
      spent: 0,
      status: 'Active',
      type: newCardType,
      merchant: newCardMerchant || 'Universal Merchant'
    };

    setCards((prev) => [newCard, ...prev]);

    if (newCardMerchant) {
      setAuthorizedMerchants((prev) => ({
        ...prev,
        [newId]: { [newCardMerchant]: true, 'Other Merchants': false }
      }));
    }

    setNewCardName('');
    setNewCardMerchant('');
    setNewCardLimit('1000');
    setIsCreating(false);
  };

  const handleUpdateLimit = (id: string, newVal: number) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, limit: newVal } : c)));
  };

  const handleToggleMerchant = (cardId: string, merchantKey: string) => {
    setAuthorizedMerchants((prev) => {
      const cardMap = prev[cardId] || {};
      return {
        ...prev,
        [cardId]: {
          ...cardMap,
          [merchantKey]: !cardMap[merchantKey]
        }
      };
    });
  };

  const totalCardLimit = cards.reduce((sum, c) => sum + c.limit, 0);
  const totalCardSpent = cards.reduce((sum, c) => sum + c.spent, 0);

  const selectedCard = cards.find((c) => c.id === selectedCardId);

  if (selectedCard) {
    const isFullShown = showFullNumbers[selectedCard.id];
    const spendPercent = Math.min(100, Math.round((selectedCard.spent / selectedCard.limit) * 100));
    const cardMerchants = authorizedMerchants[selectedCard.id] || { 'Universal Merchant': true };

    return (
      <PageWrapper
        category="Virtual Cards"
        title={`Card Inspector: ${selectedCard.name}`}
        subtitle="Detailed merchant limits, spend gating, and real-time ledger logs."
        actions={
          <button
            onClick={() => setSelectedCardId(null)}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-[#fafafc] transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to List
          </button>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Visual card space (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-sans">Corporate Card Render</h4>

              <div
                className={`relative p-6 rounded-2xl bg-gradient-to-tr ${
                  selectedCard.status === 'Frozen'
                    ? 'from-gray-700 to-gray-800'
                    : selectedCard.type === 'Single-use'
                    ? 'from-indigo-900 to-slate-900 shadow-lg shadow-indigo-950/25'
                    : 'from-blue-600 to-indigo-800 shadow-lg shadow-indigo-900/15'
                } text-white font-mono min-h-[190px] flex flex-col justify-between`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm font-semibold tracking-widest text-indigo-200 pb-2">Imari Commercial</span>
                  <div className="w-11 h-8 bg-white/10 rounded-md backdrop-blur-sm border border-white/10 flex items-center justify-center p-1">
                    <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-sm" />
                  </div>
                </div>

                <div className="text-xl font-bold tracking-[0.22em] my-4 leading-none select-all">
                  {isFullShown ? `4111 2222 3333 ${selectedCard.cvv}` : selectedCard.number}
                </div>

                <div className="flex justify-between items-end text-[11px] text-white/75">
                  <div>
                    <span className="block text-[8px] uppercase text-white/40 mb-0.5">Cardholder</span>
                    <span className="font-semibold tracking-wider text-white uppercase">Imari corporate</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase text-white/40 mb-0.5">Expires</span>
                    <span className="font-semibold tracking-wider text-white">{selectedCard.expiry}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase text-white/40 mb-0.5">CVV</span>
                    <span className="font-semibold tracking-wider text-white">{isFullShown ? selectedCard.cvv : '•••'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons to Freeze or reveal */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleReveal(selectedCard.id)}
                  className="flex-1 flex items-center justify-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold py-2.5 rounded-xl transition-all"
                >
                  {isFullShown ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Hide Credentials
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Reveal Full Credentials
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleFreeze(selectedCard.id)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    selectedCard.status === 'Frozen' ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold' : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                  }`}
                >
                  {selectedCard.status === 'Frozen' ? (
                    <>
                      <Unlock className="w-4 h-4" />
                      Unfreeze Asset
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Freeze Asset
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Core Settings / Limit adjustments (Span 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h4 className="text-sm font-bold text-gray-950 font-sans tracking-tight mb-4">Interactive Limits Tuning</h4>

              <div className="space-y-6">
                <div className="flex justify-between text-xs font-sans">
                  <span className="font-bold text-gray-400 uppercase tracking-wide">Monthly Spent Ratio</span>
                  <span className="font-mono font-bold text-gray-900 text-right">
                    ${selectedCard.spent.toLocaleString()} / <span className="text-indigo-600">${selectedCard.limit.toLocaleString()}</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min={Math.max(1000, Math.ceil(selectedCard.spent))}
                    max="100000"
                    step="5000"
                    value={selectedCard.limit}
                    onChange={(e) => handleUpdateLimit(selectedCard.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-ew-resize accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                    <span>Min: ${Math.max(1000, Math.ceil(selectedCard.spent)).toLocaleString()}</span>
                    <span>Max: $100,000</span>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/20 flex items-start gap-3">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-indigo-700 font-medium leading-relaxed font-sans">
                    Sliding the adjuster tunes the virtual authorization limit instantly. Charges exceeding this ratio will be declined immediately at the terminal.
                  </p>
                </div>
              </div>
            </div>

            {/* Merchant Restrictors (Toggle map) */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h4 className="text-sm font-bold text-gray-950 font-sans tracking-tight mb-4">Merchant Gating Whitelist</h4>
              <p className="text-xs text-gray-400 mt-0.5 mb-5 font-sans leading-relaxed">
                Approve or restrict individual payment destinations on this instrument to mitigate risk.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.keys(cardMerchants).map((mKey) => (
                  <div
                    key={mKey}
                    onClick={() => handleToggleMerchant(selectedCard.id, mKey)}
                    className="flex justify-between items-center p-3 border border-gray-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800 tracking-wide block leading-tight">{mKey}</span>
                      <span className="text-[10px] text-gray-400 font-medium">Auto-authorized block</span>
                    </div>
                    <div className={`w-8 h-5 rounded-full p-0.5 transition-colors ${cardMerchants[mKey] ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${cardMerchants[mKey] ? 'translate-x-3' : 'translate-x-0'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      category="Financial Admin"
      title="Virtual Corporate Cards"
      subtitle="Issue, restrict, and oversee virtual debit and credit instruments immediately."
      actions={
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-xl text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Issue Account Card
        </button>
      }
    >
      {/* Cards stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="ACTIVE CARDS SPEND"
          value={`$${totalCardSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          delta={`Out of $${totalCardLimit.toLocaleString('en-US')} authorized limit.`}
          deltaVariant="neutral"
          icon="credit_card"
        />
        <StatCard
          label="TOTAL CARDS ISSUED"
          value={String(cards.length)}
          delta={`${cards.filter((c) => c.status === 'Active').length} currently active`}
          deltaVariant="neutral"
          icon="shield_check"
        />
        <StatCard
          label="AVG SPEND EFFICIENCY"
          value="84.2%"
          delta="+3.1%"
          deltaVariant="success"
          icon="activity"
        />
      </div>

      {isCreating && (
        <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-md animate-fade-in">
          <h4 className="text-base font-bold text-gray-900 tracking-tight mb-4">Issue Corporate Virtual Card</h4>
          <form onSubmit={handleCreateCard} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Card Name / Purpose</label>
              <input
                type="text"
                required
                placeholder="e.g. AWS Production Billing"
                value={newCardName}
                onChange={(e) => setNewCardName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Monthly Spend Limit ($)</label>
              <input
                type="number"
                required
                placeholder="5000"
                value={newCardLimit}
                onChange={(e) => setNewCardLimit(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Card Type</label>
              <select
                value={newCardType}
onChange={(e) => setNewCardType(e.target.value as 'Single-use' | 'Recurring')}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white appearance-none cursor-pointer"
              >
                <option value="Recurring">Recurring Monthly</option>
                <option value="Single-use">Single-Use Burner</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700">
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Corporate Cards Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cards.map((card) => (
          <VirtualCardCard
            key={card.id}
            card={card}
            isFullShown={!!showFullNumbers[card.id]}
            onToggleReveal={handleToggleReveal}
            onToggleFreeze={handleToggleFreeze}
            onOpenInspector={setSelectedCardId}
          />
        ))}
      </div>
    </PageWrapper>
  );
}

 
           