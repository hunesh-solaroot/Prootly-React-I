type Props = {
  visible: boolean;
  states: string[];
  selectedStates: string[];
  onStatesChange: (vals: string[]) => void;
  clients: string[];
  selectedClients: string[];
  onClientsChange: (vals: string[]) => void;
  dateRange?: { from?: string; to?: string };
  onDateRangeChange: (r: {from?: string; to?: string}) => void;
  onClearAll: () => void;
};

export default function FiltersBar({
  visible, states, selectedStates, onStatesChange,
  clients, selectedClients, onClientsChange,
  dateRange, onDateRangeChange, onClearAll
}: Props) {
  if (!visible) return null;
  
  return (
    <div className="flex items-center gap-4 pl-5 ml-4 mt-3 bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
      <div className="flex items-center gap-2">
        <span className="text-gray-500">🏷</span>
        <select
          multiple
          value={selectedStates}
          onChange={(e) => onStatesChange(Array.from(e.target.selectedOptions).map(o => o.value))}
          className="min-w-[140px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:text-white dark:border-slate-700"
        >
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-500">👤</span>
        <select
          multiple
          value={selectedClients}
          onChange={(e) => onClientsChange(Array.from(e.target.selectedOptions).map(o => o.value))}
          className="min-w-[140px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:text-white dark:border-slate-700"
        >
          {clients.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-500">📅</span>
        <input
          type="date"
          value={dateRange?.from ?? ''}
          onChange={(e) => onDateRangeChange({ from: e.target.value, to: dateRange?.to })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500 dark:bg-slate-800 dark:text-white dark:border-slate-700"
        />
        <span>-</span>
        <input
          type="date"
          value={dateRange?.to ?? ''}
          onChange={(e) => onDateRangeChange({ from: dateRange?.from, to: e.target.value })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500 dark:bg-slate-800 dark:text-white dark:border-slate-700"
        />
        <button 
          onClick={onClearAll} 
          className="ml-2 px-3 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:text-white transition-colors"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
