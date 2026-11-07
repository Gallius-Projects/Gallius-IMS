import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function SearchableDropdown({
  label,
  data = [],
  value,
  onChange,
  placeholder = 'Select',
  required = false,
}: {
  label: string;
  data: unknown[];
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder: string;
  required?: boolean;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const filteredItems = data?.filter((item: unknown) => {
    const itemName =
      `${item?.name || item?.value || `${item?.firstName} ${item?.lastName}`}`.toLowerCase();

    return itemName.includes(search.toLowerCase());
  });

  useEffect(() => {
    const selectedItem = data?.find((item: unknown) => item?.id === value);

    const delayDebounceFn = setTimeout(() => {
      setSearch(selectedItem?.name || selectedItem?.value || '');
    }, 300); // Debounce search
    return () => clearTimeout(delayDebounceFn);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);

        // if (!search) {
        //   setSearch('');
        // }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <input
          type="text"
          value={search}
          placeholder={placeholder}
          onFocus={() => setShowOptions(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowOptions(true);
          }}
          required={required}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
        />

        {/* Clear button */}
        <div className="absolute top-1/2 right-3 flex -translate-y-1/2 gap-2">
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                onChange(null);
                setShowOptions(true);
              }}
              className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear category"
            >
              ✕
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              // onChange(null);
              setShowOptions(!showOptions);
            }}
            className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Toggle dropdown"
          >
            <ChevronDown
              className={
                showOptions
                  ? 'h-4 w-4 rotate-180 transition-transform duration-300'
                  : 'h-4 w-4 transition-transform duration-300'
              }
            />
          </button>
        </div>
      </div>

      {showOptions && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
          {filteredItems.length > 0 ? (
            filteredItems.map((item: any) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onChange(item.id);

                  setSearch(item.name);
                  setShowOptions(false);
                }}
                className="hover:shadow-b block w-full cursor-pointer px-3.5 py-2.5 text-left text-sm text-slate-900 hover:bg-slate-100 hover:shadow-md dark:text-white dark:hover:bg-slate-800"
              >
                {item.name}
              </button>
            ))
          ) : (
            <div className="px-3.5 py-2.5 text-sm text-slate-500">
              No {label.toLowerCase()} found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
