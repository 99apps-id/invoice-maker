import React, { useState, useRef, useEffect } from 'react';
import { Landmark } from 'lucide-react';
import { searchBankDatabase, type BankItem } from '../../constants/banks';

interface BankSelectorInputProps {
  bankName: string;
  swiftCode: string;
  onSelectBank: (bankName: string, swiftCode: string) => void;
  onBankNameChange: (bankName: string) => void;
  onSwiftCodeChange: (swiftCode: string) => void;
}

export const BankSelectorInput: React.FC<BankSelectorInputProps> = ({
  bankName,
  swiftCode,
  onSelectBank,
  onBankNameChange,
  onSwiftCodeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<BankItem[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSuggestions(searchBankDatabase(bankName, 10));
  }, [bankName]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (item: BankItem) => {
    onSelectBank(item.name, item.swiftCode);
    setIsOpen(false);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" ref={containerRef}>
      {/* Bank Name Input with Dropdown Autocomplete */}
      <div className="relative">
        <label className="text-[11px] font-semibold text-slate-500 block mb-1">
          Nama Bank / Institusi
        </label>
        <div className="relative">
          <input
            type="text"
            value={bankName}
            onChange={(e) => {
              onBankNameChange(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Ketik atau pilih bank (e.g. BCA, Mandiri, Wise)..."
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
          <Landmark className="w-3.5 h-3.5 absolute right-3 top-3 text-slate-400 pointer-events-none" />
        </div>

        {/* Autocomplete Suggestions Menu */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 mb-1">
              <span>Database SWIFT Bank Global</span>
              <span>Kode BIC</span>
            </div>
            {suggestions.map((item) => (
              <button
                key={`${item.name}-${item.swiftCode}`}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition group"
              >
                <div className="truncate pr-2">
                  <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block truncate">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {item.country} • {item.category}
                  </span>
                </div>
                <span className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md shrink-0">
                  {item.swiftCode}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SWIFT Code Input */}
      <div>
        <label className="text-[11px] font-semibold text-slate-500 block mb-1">
          Kode SWIFT / BIC (Otomatis)
        </label>
        <input
          type="text"
          value={swiftCode}
          onChange={(e) => onSwiftCodeChange(e.target.value)}
          placeholder="e.g. CENAIDJA"
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400"
        />
      </div>
    </div>
  );
};
