'use client';

import { useUserContext } from '@/context/UserContext';
import axiosInstance from '@/lib/axiosInstance';
import {
  LucideBoxes,
  LucideCheck,
  LucideCheckCheck,
  LucideHome,
  LucidePackageOpen,
  LucideSend,
  LucideWrench,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface InventoryItem {
  id: number;
  name: string;
  oldAssetTag: string;
  newAssetTag: string;
  serialNumber: string;
  description: string;
  hostname: string;
  categoryId: number;
  category: { id: number; name: string } | null;
  brandId: number;
  brand: { id: number; name: string } | null;
  locationId: number;
  location: { id: number; name: string } | null;
  officeId: number;
  office: { id: number; name: string } | null;
  status: string;
  assignedTo: number;
  createdAt: string;
  updatedAt: string;
  remarks: string;
}

export default function Dashboard() {
  // Auth check
  const { user, isAuthenticated } = useUserContext();

  // Data states
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch Items callback
  const fetchItems = useCallback(async () => {
    if (!localStorage.getItem('auth_token')) return;
    setIsLoading(true);
    setError('');
    try {
      const params: any = {};

      const response = await axiosInstance.get('/items', { params });
      setItems(response.data);
    } catch (err: any) {
      console.error('Fetch items error:', err);
      setError(
        err.message ||
          'Could not connect to the database. Make sure MySQL is running.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trigger fetch when parameters change
  useEffect(() => {
    if (isAuthenticated) {
      const delayDebounceFn = setTimeout(() => {
        fetchItems();
      }, 300); // Debounce search
      return () => clearTimeout(delayDebounceFn);
    }
  }, [fetchItems, isAuthenticated]);

  const totalItems = items.length;
  const deployedItems = items.filter(
    (item) => item.status === 'DEPLOYED'
  ).length;
  const spareItems = items.filter((item) => item.status === 'SPARE').length;
  const maintenanceItems = items.filter(
    (item) => item.status === 'MAINTENANCE'
  ).length;

  return (
    <div className="flex max-h-screen min-h-screen flex-col bg-slate-50/50 px-4 py-8 font-sans text-slate-900 transition-all duration-300 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
      <div className="mb-6 flex w-fit gap-2 border-b-2 border-slate-300 pr-2 pb-2 dark:border-slate-700">
        <LucideHome />
        <h5 className="font-league-spartan text-lg font-bold text-slate-900 dark:text-slate-100">
          Dashboard
        </h5>
      </div>

      <section className="flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
            {/* Decorative background */}
            <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-violet-500/5 transition-transform duration-300 group-hover:scale-125" />

            {/* Header */}
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                  <LucideBoxes size={21} />
                </div>

                <div>
                  <h6 className="font-league-spartan text-base font-bold text-slate-700 dark:text-slate-200">
                    Total Items
                  </h6>

                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Inventory Overview
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </div>
            </div>

            {/* Main Number */}
            <div className="relative mt-6">
              <p className="font-league-spartan text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                {totalItems}
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Total items currently registered
              </p>
            </div>
          </div>

          {/* Card 2 - Deployed Items */}
          <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
            {/* Decorative background */}
            <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-blue-500/5 transition-transform duration-300 group-hover:scale-125" />

            {/* Header */}
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <LucideSend size={21} />
                </div>

                <div>
                  <h6 className="font-league-spartan text-base font-bold text-slate-700 dark:text-slate-200">
                    Deployed Items
                  </h6>

                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Deployment Overview
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Deployed
              </div>
            </div>

            {/* Main Number */}
            <div className="relative mt-6">
              <p className="font-league-spartan text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                {deployedItems}
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Items currently deployed
              </p>
            </div>
          </div>

          {/* Card 3 - Spare Items */}
          <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
            {/* Decorative background */}
            <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-amber-500/5 transition-transform duration-300 group-hover:scale-125" />

            {/* Header */}
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                  <LucidePackageOpen size={21} />
                </div>

                <div>
                  <h6 className="font-league-spartan text-base font-bold text-slate-700 dark:text-slate-200">
                    Spare Items
                  </h6>

                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Spare Inventory
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Available
              </div>
            </div>

            {/* Main Number */}
            <div className="relative mt-6">
              <p className="font-league-spartan text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                {spareItems}
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Items available as spares
              </p>
            </div>
          </div>

          {/* Card 4 - Maintenance Items */}
          <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
            {/* Decorative background */}
            <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-orange-500/5 transition-transform duration-300 group-hover:scale-125" />

            {/* Header */}
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  <LucideWrench size={21} />
                </div>

                <div>
                  <h6 className="font-league-spartan text-base font-bold text-slate-700 dark:text-slate-200">
                    Maintenance Items
                  </h6>

                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Maintenance Overview
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                Maintenance
              </div>
            </div>

            {/* Main Number */}
            <div className="relative mt-6">
              <p className="font-league-spartan text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                {maintenanceItems}
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Items currently under maintenance
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
