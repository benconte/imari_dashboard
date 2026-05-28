"use client";

interface EmptyStateProps {
  icon?: string;
  message: string;
}

export default function EmptyState({ icon = "inbox", message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="material-symbols-outlined text-gray-300 text-4xl mb-3">{icon}</span>
      <p className="text-sm text-gray-400 font-medium">{message}</p>
    </div>
  );
}
