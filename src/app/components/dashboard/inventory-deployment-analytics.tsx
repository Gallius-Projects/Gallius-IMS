'use client';

import React, { useMemo, useState } from 'react';
import {
  LucideBuilding2,
  LucideMapPin,
  LucideLayers,
  LucideBarChart3,
  LucideBarChartHorizontal,
  LucidePieChart,
  LucideRotateCcw,
  LucideFilter,
  LucideArrowUpRight,
  LucideTrophy,
  LucideInfo,
  LucideCheck,
  LucideSlidersHorizontal,
} from 'lucide-react';
import { useLibrariesContext } from '@/context/LibrariesContext';

export interface DashboardInventoryItem {
  id: number;
  name: string;
  oldAssetTag?: string | null;
  newAssetTag?: string | null;
  serialNumber?: string | null;
  description?: string | null;
  hostname?: string | null;
  categoryId?: number;
  category?: { id: number; name: string } | null;
  brandId?: number;
  brand?: { id: number; name: string } | null;
  locationId?: number;
  location?: { id: number; name: string; abbreviation?: string | null } | null;
  officeId?: number;
  office?: { id: number; name: string; abbreviation?: string | null } | null;
  status: string;
  assignedTo?: number | null;
  assignedEmp?: {
    id: number;
    firstName: string;
    lastName: string;
    departmentId?: number;
    department?: { id: number; name: string; abbreviation?: string | null } | null;
  } | null;
  remarks?: string | null;
}

interface InventoryDeploymentAnalyticsProps {
  items: DashboardInventoryItem[];
  isLoading?: boolean;
}

// Curated harmonious color palette for charts & visual cues
const COLOR_PALETTE = [
  {
    hex: '#6366f1',
    from: 'from-indigo-500',
    to: 'to-indigo-600',
    bg: 'bg-indigo-500',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-500/20',
    lightBg: 'bg-indigo-50 dark:bg-indigo-500/10',
  },
  {
    hex: '#06b6d4',
    from: 'from-cyan-500',
    to: 'to-cyan-600',
    bg: 'bg-cyan-500',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-500/20',
    lightBg: 'bg-cyan-50 dark:bg-cyan-500/10',
  },
  {
    hex: '#8b5cf6',
    from: 'from-violet-500',
    to: 'to-purple-600',
    bg: 'bg-violet-500',
    text: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-500/20',
    lightBg: 'bg-violet-50 dark:bg-violet-500/10',
  },
  {
    hex: '#10b981',
    from: 'from-emerald-500',
    to: 'to-teal-600',
    bg: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/20',
    lightBg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
  {
    hex: '#f59e0b',
    from: 'from-amber-500',
    to: 'to-orange-500',
    bg: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/20',
    lightBg: 'bg-amber-50 dark:bg-amber-500/10',
  },
  {
    hex: '#ec4899',
    from: 'from-pink-500',
    to: 'to-rose-600',
    bg: 'bg-pink-500',
    text: 'text-pink-600 dark:text-pink-400',
    border: 'border-pink-500/20',
    lightBg: 'bg-pink-50 dark:bg-pink-500/10',
  },
  {
    hex: '#3b82f6',
    from: 'from-blue-500',
    to: 'to-sky-600',
    bg: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/20',
    lightBg: 'bg-blue-50 dark:bg-blue-500/10',
  },
  {
    hex: '#14b8a6',
    from: 'from-teal-500',
    to: 'to-emerald-600',
    bg: 'bg-teal-500',
    text: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-500/20',
    lightBg: 'bg-teal-50 dark:bg-teal-500/10',
  },
];

export default function InventoryDeploymentAnalytics({
  items,
  isLoading = false,
}: InventoryDeploymentAnalyticsProps) {
  const { departments, locations, offices, employees } = useLibrariesContext();

  // Filter states
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedOffice, setSelectedOffice] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('DEPLOYED');
  const [chartView, setChartView] = useState<'horizontal' | 'vertical'>('horizontal');
  const [distDimension, setDistDimension] = useState<'location' | 'office'>('location');
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Helper to resolve an item's department robustly
  const getItemDepartment = (item: DashboardInventoryItem) => {
    // 1. Direct from assigned employee relation
    if (item.assignedEmp?.department?.name) {
      return {
        id: item.assignedEmp.department.id,
        name: item.assignedEmp.department.name,
        abbreviation: item.assignedEmp.department.abbreviation || '',
      };
    }

    // 2. From assigned employee's departmentId
    if (item.assignedEmp?.departmentId && Array.isArray(departments)) {
      const match = departments.find((d) => d.id === item.assignedEmp?.departmentId);
      if (match) {
        return {
          id: match.id,
          name: match.name,
          abbreviation: match.abbreviation || '',
        };
      }
    }

    // 3. Fallback: match via assignedTo ID in employees list
    if (item.assignedTo && Array.isArray(employees)) {
      const emp = employees.find((e) => e.id === item.assignedTo);
      if (emp?.departmentId && Array.isArray(departments)) {
        const match = departments.find((d) => d.id === emp.departmentId);
        if (match) {
          return {
            id: match.id,
            name: match.name,
            abbreviation: match.abbreviation || '',
          };
        }
      }
    }

    return {
      id: null,
      name: 'Unassigned Dept',
      abbreviation: 'UNASSIGNED',
    };
  };

  // Filtered items based on location, office/tenant, and status
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Status filter
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'all') {
        const locId = Number(selectedLocation);
        const itemLocId = item.locationId ?? item.location?.id;
        if (itemLocId !== locId) return false;
      }

      // Office / Tenant filter
      if (selectedOffice !== 'all') {
        const offId = Number(selectedOffice);
        const itemOffId = item.officeId ?? item.office?.id;
        if (itemOffId !== offId) return false;
      }

      return true;
    });
  }, [items, statusFilter, selectedLocation, selectedOffice]);

  // Aggregate items by Department
  const departmentData = useMemo(() => {
    const map = new Map<
      string,
      {
        id: number | null;
        name: string;
        abbreviation: string;
        count: number;
        items: DashboardInventoryItem[];
        categories: Record<string, number>;
      }
    >();

    // Initialize all departments from libraries so even 0-deployed departments can be seen if needed
    if (Array.isArray(departments)) {
      departments.forEach((dept) => {
        map.set(dept.name, {
          id: dept.id,
          name: dept.name,
          abbreviation: dept.abbreviation || '',
          count: 0,
          items: [],
          categories: {},
        });
      });
    }

    // Tally from filtered items
    filteredItems.forEach((item) => {
      const dept = getItemDepartment(item);
      let entry = map.get(dept.name);
      if (!entry) {
        entry = {
          id: dept.id,
          name: dept.name,
          abbreviation: dept.abbreviation,
          count: 0,
          items: [],
          categories: {},
        };
        map.set(dept.name, entry);
      }
      entry.count += 1;
      entry.items.push(item);

      const catName = item.category?.name || 'Other';
      entry.categories[catName] = (entry.categories[catName] || 0) + 1;
    });

    const total = filteredItems.length;

    // Filter to departments that have items, or all if none
    const list = Array.from(map.values())
      .filter((d) => d.count > 0)
      .sort((a, b) => b.count - a.count);

    return list.map((dept, index) => {
      const color = COLOR_PALETTE[index % COLOR_PALETTE.length];
      const percentage = total > 0 ? (dept.count / total) * 100 : 0;
      return {
        ...dept,
        percentage,
        color,
      };
    });
  }, [filteredItems, departments, employees]);

  // Aggregate items by Location (for distribution chart)
  const locationData = useMemo(() => {
    const map = new Map<
      string,
      { id: number | null; name: string; abbreviation: string; count: number }
    >();

    filteredItems.forEach((item) => {
      const name = item.location?.name || 'Unassigned Location';
      const id = item.locationId ?? item.location?.id ?? null;
      const abbreviation = item.location?.abbreviation || '';
      const existing = map.get(name) || { id, name, abbreviation, count: 0 };
      existing.count += 1;
      map.set(name, existing);
    });

    const total = filteredItems.length;
    return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .map((loc, idx) => ({
        ...loc,
        percentage: total > 0 ? (loc.count / total) * 100 : 0,
        color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
      }));
  }, [filteredItems]);

  // Aggregate items by Office / Tenant (for distribution chart)
  const officeData = useMemo(() => {
    const map = new Map<
      string,
      { id: number | null; name: string; abbreviation: string; count: number }
    >();

    filteredItems.forEach((item) => {
      const name = item.office?.name || 'Unassigned Office / Tenant';
      const id = item.officeId ?? item.office?.id ?? null;
      const abbreviation = item.office?.abbreviation || '';
      const existing = map.get(name) || { id, name, abbreviation, count: 0 };
      existing.count += 1;
      map.set(name, existing);
    });

    const total = filteredItems.length;
    return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .map((off, idx) => ({
        ...off,
        percentage: total > 0 ? (off.count / total) * 100 : 0,
        color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
      }));
  }, [filteredItems]);

  const activeDistributionData =
    distDimension === 'location' ? locationData : officeData;

  // Maximum count for normalizing bar chart widths/heights
  const maxDepartmentCount = useMemo(() => {
    if (departmentData.length === 0) return 1;
    return Math.max(...departmentData.map((d) => d.count), 1);
  }, [departmentData]);

  // Summary KPIs
  const totalDeployedInView = filteredItems.length;
  const topDepartment = departmentData[0] || null;
  const activeDepartmentsCount = departmentData.length;

  const hasActiveFilters =
    selectedLocation !== 'all' ||
    selectedOffice !== 'all' ||
    statusFilter !== 'DEPLOYED';

  const handleResetFilters = () => {
    setSelectedLocation('all');
    setSelectedOffice('all');
    setStatusFilter('DEPLOYED');
  };

  // Pre-calculate Donut Chart SVG paths using stroke-dasharray
  const donutRadius = 60;
  const donutStrokeWidth = 24;
  const donutCircumference = 2 * Math.PI * donutRadius;

  let accumulatedDonutPercent = 0;
  const donutSegments = activeDistributionData.map((item) => {
    const strokeDasharray = `${(item.percentage / 100) * donutCircumference} ${donutCircumference}`;
    const strokeDashoffset = -((accumulatedDonutPercent / 100) * donutCircumference);
    accumulatedDonutPercent += item.percentage;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Top Filter and Controls Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Header Title & Description */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20">
              <LucideBarChart3 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-league-spartan text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  Inventory Deployment Analytics
                </h3>
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  {statusFilter === 'DEPLOYED' ? 'Deployed Assets' : `${statusFilter} Assets`}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualize asset allocations across departments, with location and office/tenant filters
              </p>
            </div>
          </div>

          {/* Filter Dropdowns and Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="relative flex items-center">
              <LucideSlidersHorizontal
                size={14}
                className="pointer-events-none absolute left-3 text-slate-400"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by item status"
                className="h-9.5 cursor-pointer rounded-xl border border-slate-200 bg-slate-50/80 py-1.5 pr-8 pl-8 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
              >
                <option value="DEPLOYED">Status: Deployed (Default)</option>
                <option value="ALL">Status: All Inventory</option>
                <option value="SPARE">Status: Spare Only</option>
                <option value="DEFECTIVE">Status: Defective Only</option>
                <option value="DISPOSED">Status: Disposed Only</option>
              </select>
            </div>

            {/* Location Filter */}
            <div className="relative flex items-center">
              <LucideMapPin
                size={14}
                className="pointer-events-none absolute left-3 text-slate-400"
              />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                aria-label="Filter by location"
                className="h-9.5 cursor-pointer rounded-xl border border-slate-200 bg-slate-50/80 py-1.5 pr-8 pl-8 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
              >
                <option value="all">All Locations</option>
                {Array.isArray(locations) &&
                  locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} {loc.abbreviation ? `(${loc.abbreviation})` : ''}
                    </option>
                  ))}
              </select>
            </div>

            {/* Office / Tenant Filter */}
            <div className="relative flex items-center">
              <LucideBuilding2
                size={14}
                className="pointer-events-none absolute left-3 text-slate-400"
              />
              <select
                value={selectedOffice}
                onChange={(e) => setSelectedOffice(e.target.value)}
                aria-label="Filter by office or tenant"
                className="h-9.5 cursor-pointer rounded-xl border border-slate-200 bg-slate-50/80 py-1.5 pr-8 pl-8 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
              >
                <option value="all">All Offices / Tenants</option>
                {Array.isArray(offices) &&
                  offices.map((office) => (
                    <option key={office.id} value={office.id}>
                      {office.name} {office.abbreviation ? `(${office.abbreviation})` : ''}
                    </option>
                  ))}
              </select>
            </div>

            {/* Reset Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex h-9.5 cursor-pointer items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-medium text-rose-600 transition-all hover:bg-rose-100 hover:shadow-sm dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-900/50"
                title="Reset all filters"
              >
                <LucideRotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {hasActiveFilters && (
          <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
            <span className="flex items-center gap-1 font-medium text-slate-400">
              <LucideFilter size={12} /> Active Filters:
            </span>

            {statusFilter !== 'DEPLOYED' && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                Status: {statusFilter}
                <button
                  type="button"
                  onClick={() => setStatusFilter('DEPLOYED')}
                  className="cursor-pointer text-indigo-400 hover:text-indigo-800 dark:hover:text-white"
                >
                  ×
                </button>
              </span>
            )}

            {selectedLocation !== 'all' && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-50 px-2 py-0.5 text-[11px] font-semibold text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
                Location:{' '}
                {Array.isArray(locations)
                  ? locations.find((l) => l.id === Number(selectedLocation))?.name || selectedLocation
                  : selectedLocation}
                <button
                  type="button"
                  onClick={() => setSelectedLocation('all')}
                  className="cursor-pointer text-cyan-400 hover:text-cyan-800 dark:hover:text-white"
                >
                  ×
                </button>
              </span>
            )}

            {selectedOffice !== 'all' && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                Office / Tenant:{' '}
                {Array.isArray(offices)
                  ? offices.find((o) => o.id === Number(selectedOffice))?.name || selectedOffice
                  : selectedOffice}
                <button
                  type="button"
                  onClick={() => setSelectedOffice('all')}
                  className="cursor-pointer text-violet-400 hover:text-violet-800 dark:hover:text-white"
                >
                  ×
                </button>
              </span>
            )}

            <span className="ml-auto text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Displaying <strong className="text-slate-800 dark:text-slate-200">{filteredItems.length}</strong> matching item{filteredItems.length === 1 ? '' : 's'}
            </span>
          </div>
        )}
      </div>

      {/* Main Grid: Card 1 (Department Graph) & Card 2 (Location / Office Distribution) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Card 1: Department Deployments (7 cols on lg) */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <div>
            {/* Card Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-league-spartan text-lg font-bold text-slate-800 dark:text-slate-100">
                    Deployed Items by Department
                  </h4>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {activeDepartmentsCount} {activeDepartmentsCount === 1 ? 'Dept' : 'Depts'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total inventory items currently assigned and deployed per department
                </p>
              </div>

              {/* Chart View Toggle */}
              <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-50/80 p-1 dark:border-slate-700/80 dark:bg-slate-800/80">
                <button
                  type="button"
                  onClick={() => setChartView('horizontal')}
                  className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    chartView === 'horizontal'
                      ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-indigo-400'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                  title="Horizontal Bar View"
                >
                  <div className="flex items-center gap-1.5">
                    <LucideBarChartHorizontal size={14} />
                    <span>Bar</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setChartView('vertical')}
                  className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    chartView === 'vertical'
                      ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-indigo-400'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                  title="Vertical Column View"
                >
                  <div className="flex items-center gap-1.5">
                    <LucideBarChart3 size={14} />
                    <span>Column</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="mt-5 grid grid-cols-3 gap-3 border-y border-slate-100 py-3.5 dark:border-slate-800/80">
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  Total in View
                </span>
                <span className="font-league-spartan text-xl font-bold text-slate-900 dark:text-white">
                  {totalDeployedInView}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  Top Department
                </span>
                <span className="truncate font-league-spartan text-xl font-bold text-indigo-600 dark:text-indigo-400" title={topDepartment?.name || 'N/A'}>
                  {topDepartment ? topDepartment.abbreviation || topDepartment.name : 'None'}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  Top Dept Share
                </span>
                <span className="font-league-spartan text-xl font-bold text-slate-900 dark:text-white">
                  {topDepartment ? `${topDepartment.percentage.toFixed(1)}%` : '0%'}
                </span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="mt-5 min-h-[300px]">
              {isLoading ? (
                <div className="flex h-64 flex-col items-center justify-center gap-2 text-slate-400">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                  <span className="text-xs">Loading analytics data...</span>
                </div>
              ) : departmentData.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                    <LucideInfo size={22} />
                  </div>
                  <div>
                    <h5 className="font-league-spartan text-base font-bold text-slate-700 dark:text-slate-200">
                      No Deployed Items Found
                    </h5>
                    <p className="mt-1 text-xs text-slate-400">
                      There are no matching items for the current filter criteria.
                    </p>
                  </div>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="cursor-pointer rounded-xl bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-600 transition-all hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              ) : chartView === 'horizontal' ? (
                /* HORIZONTAL BAR CHART */
                <div className="space-y-4">
                  {departmentData.map((dept, idx) => {
                    const isHovered = hoveredDept === dept.name;
                    const isTop = idx === 0;

                    return (
                      <div
                        key={dept.name}
                        onMouseEnter={() => setHoveredDept(dept.name)}
                        onMouseLeave={() => setHoveredDept(null)}
                        className={`group/row relative rounded-xl p-2.5 transition-all duration-200 ${
                          isHovered
                            ? 'bg-slate-50/80 dark:bg-slate-800/60'
                            : 'hover:bg-slate-50/40 dark:hover:bg-slate-800/30'
                        }`}
                      >
                        {/* Row Header */}
                        <div className="mb-1.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            {/* Rank Badge */}
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold ${
                                isTop
                                  ? 'bg-amber-100 text-amber-700 shadow-xs dark:bg-amber-500/20 dark:text-amber-400'
                                  : idx === 1
                                  ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                  : idx === 2
                                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'
                                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                              }`}
                            >
                              {idx + 1}
                            </span>

                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {dept.name}
                            </span>

                            {dept.abbreviation && (
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                {dept.abbreviation}
                              </span>
                            )}

                            {isTop && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.2 text-[10px] font-semibold text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                                <LucideTrophy size={10} /> Top
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-league-spartan text-sm font-bold text-slate-900 dark:text-white">
                              {dept.count}{' '}
                              <span className="text-[11px] font-normal text-slate-400">
                                {dept.count === 1 ? 'item' : 'items'}
                              </span>
                            </span>
                            <span className="w-12 text-right font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              {dept.percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        {/* Progress Track & Animated Bar */}
                        <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            style={{
                              width: `${(dept.count / maxDepartmentCount) * 100}%`,
                            }}
                            className={`h-full rounded-full bg-gradient-to-r ${dept.color.from} ${dept.color.to} transition-all duration-500 ease-out group-hover/row:brightness-110`}
                          />
                        </div>

                        {/* Interactive Tooltip Card on Hover */}
                        {isHovered && (
                          <div className="animate-fade-in mt-2 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200/60 bg-white p-2 text-[11px] text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            <span className="font-medium text-slate-400">Categories deployed:</span>
                            {Object.entries(dept.categories).slice(0, 4).map(([cat, qty]) => (
                              <span
                                key={cat}
                                className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 font-medium dark:bg-slate-700/60"
                              >
                                {cat}: <strong className="text-slate-900 dark:text-white">{qty}</strong>
                              </span>
                            ))}
                            {Object.keys(dept.categories).length > 4 && (
                              <span className="text-[10px] text-slate-400">
                                +{Object.keys(dept.categories).length - 4} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* VERTICAL COLUMN CHART (SVG) */
                <div className="flex h-72 flex-col justify-end pt-4">
                  <div className="flex h-56 items-end gap-3 px-2">
                    {departmentData.map((dept, idx) => {
                      const barHeightPercent = (dept.count / maxDepartmentCount) * 100;
                      const isHovered = hoveredDept === dept.name;

                      return (
                        <div
                          key={dept.name}
                          onMouseEnter={() => setHoveredDept(dept.name)}
                          onMouseLeave={() => setHoveredDept(null)}
                          className="group/col relative flex flex-1 flex-col items-center justify-end h-full"
                        >
                          {/* Tooltip on Top */}
                          {isHovered && (
                            <div className="animate-fade-in pointer-events-none absolute -top-12 z-20 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg dark:bg-white dark:text-slate-900">
                              {dept.name}: {dept.count} items ({dept.percentage.toFixed(1)}%)
                            </div>
                          )}

                          {/* Count on Top of Bar */}
                          <span className="mb-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                            {dept.count}
                          </span>

                          {/* Animated Column Bar */}
                          <div className="relative w-full max-w-[48px] overflow-hidden rounded-t-lg bg-slate-100 dark:bg-slate-800">
                            <div
                              style={{ height: `${Math.max(barHeightPercent, 4)}%` }}
                              className={`w-full rounded-t-lg bg-gradient-to-t ${dept.color.from} ${dept.color.to} transition-all duration-500 ease-out group-hover/col:brightness-110`}
                            />
                          </div>

                          {/* Label below Column */}
                          <span
                            className="mt-2 w-full truncate text-center text-[11px] font-medium text-slate-500 dark:text-slate-400"
                            title={dept.name}
                          >
                            {dept.abbreviation || dept.name.slice(0, 8)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Horizontal Axis Line */}
                  <div className="mt-2 border-t border-slate-200 dark:border-slate-800" />
                </div>
              )}
            </div>
          </div>

          {/* Card Footer Note */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800">
            <span>Hover on bars to inspect item categories</span>
            <span>Sorted by highest deployed items</span>
          </div>
        </div>

        {/* Card 2: Location & Office / Tenant Distribution (5 cols on lg) */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
          <div>
            {/* Card Header & Switcher */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-league-spartan text-lg font-bold text-slate-800 dark:text-slate-100">
                  Distribution Breakdown
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Inspect deployment by location or office/tenant
                </p>
              </div>

              {/* Dimension Switcher */}
              <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-50/80 p-1 dark:border-slate-700/80 dark:bg-slate-800/80">
                <button
                  type="button"
                  onClick={() => setDistDimension('location')}
                  className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    distDimension === 'location'
                      ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-indigo-400'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <LucideMapPin size={13} />
                    <span>Location</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDistDimension('office')}
                  className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    distDimension === 'office'
                      ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-indigo-400'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <LucideBuilding2 size={13} />
                    <span>Office/Tenant</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Donut Chart and Metrics */}
            {activeDistributionData.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-2 text-center text-slate-400">
                <LucidePieChart size={32} className="opacity-40" />
                <span className="text-xs">No distribution data available</span>
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center">
                {/* SVG Donut Chart with Center Total */}
                <div className="relative flex h-48 w-48 items-center justify-center">
                  <svg
                    viewBox="0 0 160 160"
                    className="h-full w-full -rotate-90 transform"
                  >
                    {/* Background track circle */}
                    <circle
                      cx="80"
                      cy="80"
                      r={donutRadius}
                      strokeWidth={donutStrokeWidth}
                      className="stroke-slate-100 dark:stroke-slate-800"
                      fill="transparent"
                    />

                    {/* Donut Segments */}
                    {donutSegments.map((segment) => {
                      const isHovered = hoveredSlice === segment.name;
                      return (
                        <circle
                          key={segment.name}
                          cx="80"
                          cy="80"
                          r={donutRadius}
                          strokeWidth={isHovered ? donutStrokeWidth + 4 : donutStrokeWidth}
                          stroke={segment.color.hex}
                          strokeDasharray={segment.strokeDasharray}
                          strokeDashoffset={segment.strokeDashoffset}
                          fill="transparent"
                          onMouseEnter={() => setHoveredSlice(segment.name)}
                          onMouseLeave={() => setHoveredSlice(null)}
                          className="cursor-pointer transition-all duration-300 ease-out"
                        />
                      );
                    })}
                  </svg>

                  {/* Center Label */}
                  <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
                    <span className="font-league-spartan text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {totalDeployedInView}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Deployed
                    </span>
                  </div>
                </div>

                {/* Legend & Breakdown List */}
                <div className="mt-6 w-full space-y-2">
                  {activeDistributionData.map((item) => {
                    const isHovered = hoveredSlice === item.name;
                    const isFilterActive =
                      distDimension === 'location'
                        ? selectedLocation === String(item.id)
                        : selectedOffice === String(item.id);

                    return (
                      <div
                        key={item.name}
                        onMouseEnter={() => setHoveredSlice(item.name)}
                        onMouseLeave={() => setHoveredSlice(null)}
                        onClick={() => {
                          if (item.id === null) return;
                          if (distDimension === 'location') {
                            setSelectedLocation((prev) =>
                              prev === String(item.id) ? 'all' : String(item.id)
                            );
                          } else {
                            setSelectedOffice((prev) =>
                              prev === String(item.id) ? 'all' : String(item.id)
                            );
                          }
                        }}
                        className={`group/item flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs transition-all duration-200 ${
                          isFilterActive
                            ? 'bg-indigo-50/80 ring-1 ring-indigo-500/30 dark:bg-indigo-950/40 dark:ring-indigo-400/30'
                            : isHovered
                            ? 'bg-slate-50 dark:bg-slate-800'
                            : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                        }`}
                        title={`Click to filter by ${item.name}`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span
                            style={{ backgroundColor: item.color.hex }}
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                          />
                          <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                            {item.name}
                          </span>
                          {item.abbreviation && (
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                              {item.abbreviation}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2.5 pl-2">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {item.count}
                          </span>
                          <span className="w-11 text-right font-mono text-[11px] text-slate-400">
                            {item.percentage.toFixed(1)}%
                          </span>
                          {isFilterActive && (
                            <LucideCheck size={13} className="text-indigo-600 dark:text-indigo-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Card Footer Quick Hint */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800">
            <span>Click any row to filter dashboard</span>
            <div className="flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400">
              <span>Interactive Drilldown</span>
              <LucideArrowUpRight size={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
