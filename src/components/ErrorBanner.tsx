import { AlertCircle } from 'lucide-react';

export default function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="fade-in flex items-start gap-2.5 rounded-sm border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
