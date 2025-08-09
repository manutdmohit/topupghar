import { AlertTriangle } from 'lucide-react';

export default function NotesWarning() {
  return (
    <div className="max-w-xl mx-auto px-4 mb-8">
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        {/* Header with Warning Icon */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-red-500 rounded-full p-2">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Notes Warning</h2>
        </div>

        {/* Warning Points */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl font-bold text-gray-800 min-w-[40px]">
              1-
            </span>
            <p className="text-gray-800 font-medium">
              You Must Read The Description Before purchasing.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl font-bold text-gray-800 min-w-[40px]">
              2-
            </span>
            <p className="text-gray-800 font-medium">
              The Profile Must Be Public, Not Private.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl font-bold text-gray-800 min-w-[40px]">
              3-
            </span>
            <p className="text-gray-800 font-medium">
              Don't Place More Then 1 Order For Same Link at the Same Time.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl font-bold text-gray-800 min-w-[40px]">
              4-
            </span>
            <p className="text-gray-800 font-medium">
              You Shouldn't Complain Before The Order Deadline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
