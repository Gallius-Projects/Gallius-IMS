import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PackageSearch,
  ArrowLeftRight,
  Settings,
  Box,
  ChevronRight,
  LucideIdCard,
  LucideUser2,
  LucideUserRoundCog,
  LucideBuilding2,
  LucideCog,
  LucideTruck,
  LucideBuilding,
  LucideMapPin,
  LucideAward,
  LucideTags,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
    category: 'home',
    access: ['superadmin', 'admin', 'user'],
  },
  {
    label: 'Assets',
    to: '/assets',
    icon: PackageSearch,
    category: 'inventory',
    access: ['superadmin', 'admin'],
  },
  {
    label: 'Transactions',
    to: '/transactions',
    icon: ArrowLeftRight,
    category: 'inventory',
    access: ['superadmin', 'admin'],
  },
  {
    label: 'Employees',
    to: '/employees',
    icon: LucideIdCard,
    category: 'user-management',
    access: ['superadmin'],
  },
  {
    label: 'Accounts',
    to: 'accounts',
    icon: LucideUser2,
    category: 'user-management',
    access: ['superadmin'],
  },
  {
    label: 'Departments',
    to: '/admin/departments',
    icon: LucideBuilding2,
    category: 'libraries',
    access: ['superadmin'],
  },
  {
    label: 'Categories',
    to: '/admin/categories',
    icon: LucideTags,
    category: 'libraries',
    access: ['superadmin'],
  },
  {
    label: 'Brands',
    to: '/admin/brands',
    icon: LucideAward,
    category: 'libraries',
    access: ['superadmin'],
  },
  {
    label: 'Locations',
    to: '/admin/locations',
    icon: LucideMapPin,
    category: 'libraries',
    access: ['superadmin'],
  },
  {
    label: 'Offices',
    to: '/admin/offices',
    icon: LucideBuilding,
    category: 'libraries',
    access: ['superadmin'],
  },
  {
    label: 'Suppliers',
    to: '/admin/suppliers',
    icon: LucideTruck,
    category: 'libraries',
    access: ['superadmin'],
  },
  {
    label: 'Roles',
    to: '/admin/roles',
    icon: LucideCog,
    category: 'user-management',
    access: ['superadmin'],
  },
  {
    label: 'Departments',
    to: '/admin/departments',
    icon: LucideBuilding2,
    category: 'user-management',
    access: ['superadmin'],
  },
  {
    label: 'Positions',
    to: '/admin/positions',
    icon: LucideUserRoundCog,
    category: 'user-management',
    access: ['superadmin'],
  },
];

interface SidebarProps {
  sidebarRef: React.RefObject<HTMLDivElement | null>;
  isSidebarExpanded: boolean;
}

export function Sidebar({ sidebarRef, isSidebarExpanded }: SidebarProps) {
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const groupedNavItems = Object.entries(
    NAV_ITEMS.reduce(
      (groups, item) => {
        const category = item.category || 'Other';

        if (!groups[category]) {
          groups[category] = [];
        }

        groups[category].push(item);

        return groups;
      },
      {} as Record<string, typeof NAV_ITEMS>,
    ),
  ).sort(([a], [b]) => {
    const priority = ['Home', 'Inventory'];

    const indexA = priority.indexOf(a);
    const indexB = priority.indexOf(b);

    if (indexA !== -1 || indexB !== -1) {
      return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
    }

    return a.localeCompare(b);
  });

  return (
    <aside
      ref={sidebarRef}
      className={`w-0 transition-all duration-300 ${isSidebarExpanded ? 'w-[250px]' : 'w-0'} h-fullflex-shrink-0 flex flex-col`}
    >
      {/* Logo */}
      <div
        className="flex h-16 items-center gap-3 border-b px-5 whitespace-nowrap"
        style={{ borderColor: 'var(--border)' }}
      >
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            G-AMS
          </p>
          <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
            Asset Management System
          </p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 whitespace-nowrap">
        <p
          className="mb-3 px-3 text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          Main Menu
        </p>

        {groupedNavItems.map(([category, items]) => {
          const isExpanded = expandedCategories[category] ?? true;

          return (
            <div key={category} className="mb-2">
              {/* Accordion Header */}
              <button
                onClick={() =>
                  setExpandedCategories((prev) => ({
                    ...prev,
                    [category]: !isExpanded,
                  }))
                }
                className="flex w-full cursor-pointer items-center justify-between px-3 py-2"
              >
                <span className="text-xs font-semibold tracking-wider uppercase">{category}</span>

                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Accordion Content */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className={`flex flex-col gap-1 overflow-hidden`}>
                  {items.map((item) => {
                    const Icon = item.icon;

                    const isActive =
                      item.to === '/dashboard'
                        ? location.pathname === '/dashboard'
                        : location.pathname.startsWith(item.to);

                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={`nav-item group ${isActive ? 'active' : ''}`}
                      >
                        <Icon size={17} className="flex-shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        {isActive && <ChevronRight size={14} className="opacity-60" />}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="flex-shrink-0 border-t px-3 py-4" style={{ borderColor: 'var(--border)' }}>
        <button className="nav-item w-full">
          <Settings size={17} className="flex-shrink-0" />
          <span className="flex-1 text-left">Settings</span>
        </button>

        <div className="mt-3 rounded-lg p-3" style={{ backgroundColor: 'var(--accent-light)' }}>
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              A
            </div>
            <div className="min-w-0">
              <p
                className="truncate text-xs font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Admin User
              </p>
              <p className="truncate text-[10px]" style={{ color: 'var(--text-muted)' }}>
                admin@assetflow.io
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
