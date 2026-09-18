import {
  LucideHome,
  LucideBuilding2,
  LucideTags,
  LucideAward,
  LucideMapPin,
  LucideBuilding,
  LucideTruck,
  LucideUsers,
  LucideMonitorCog,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Sidebar({
  sideBarRef,
  isSidebarExpanded,
}: {
  sideBarRef: React.RefObject<HTMLDivElement | null>;
  isSidebarExpanded: boolean;
}) {
  const router = useRouter();

  const directories = [
    {
      name: 'Home',
      href: '/',
      icon: LucideHome,
    },
    {
      name: 'Departments',
      href: '/inventory/departments',
      icon: LucideBuilding2,
    },
    {
      name: 'Categories',
      href: '/inventory/categories',
      icon: LucideTags,
    },
    {
      name: 'Brands',
      href: '/inventory/brands',
      icon: LucideAward,
    },
    {
      name: 'Locations',
      href: '/inventory/locations',
      icon: LucideMapPin,
    },
    {
      name: 'Offices',
      href: '/inventory/offices',
      icon: LucideBuilding,
    },
    {
      name: 'Suppliers',
      href: '/inventory/suppliers',
      icon: LucideTruck,
    },
    {
      name: 'Employees',
      href: '/inventory/employees',
      icon: LucideUsers,
    },
    {
      name: 'Inventory',
      href: '/inventory/items',
      icon: LucideMonitorCog,
    },
  ];

  return (
    <aside
      ref={sideBarRef}
      className={`fixed top-0 left-0 z-10 h-full shrink-0 overflow-hidden border-r border-slate-200 bg-white shadow-lg transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 ${
        isSidebarExpanded ? 'w-[250px]' : 'w-0'
      }`}
    >
      <div className="border-b border-slate-500 bg-slate-100 py-6 dark:border-slate-800 dark:bg-slate-900" />

      <div className="border-t border-slate-200 py-4 dark:border-slate-800">
        {directories.map((directory) => (
          <nav key={directory.name} className="flex-1 overflow-y-auto">
            <div
              onClick={() => router.push(directory.href)}
              className="flex cursor-pointer gap-2 px-4 py-3 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <directory.icon />
              <span className="text-sm">{directory.name}</span>
            </div>
          </nav>
        ))}
      </div>
    </aside>
  );
}
