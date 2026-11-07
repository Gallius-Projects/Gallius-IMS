import { useUserContext } from '@/context/UserContext';
import {
  LucideAward,
  LucideBuilding,
  LucideBuilding2,
  LucideCog,
  LucideHome,
  LucideIdCard,
  LucideMapPin,
  LucideMonitorCog,
  LucideTags,
  LucideTruck,
  LucideUser2,
  LucideUserRoundCog,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type Role = 'superadmin' | 'admin' | 'user';

export default function Sidebar({
  sideBarRef,
  isSidebarExpanded,
  userRole,
}: {
  sideBarRef: React.RefObject<HTMLDivElement | null>;
  isSidebarExpanded: boolean;
  userRole: Role;
}) {
  const router = useRouter();
  const { user } = useUserContext();

  const visibleDirectories = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LucideHome,
      category: 'home',
      access: ['superadmin', 'admin', 'user'],
    },
    {
      name: 'Inventory',
      path: '/inventory/items',
      icon: LucideMonitorCog,
      category: 'inventory',
      access: ['admin', 'superadmin'],
    },
    {
      name: 'Employees',
      path: '/admin/employees',
      icon: LucideIdCard,
      category: 'user-management',
      access: ['superadmin'],
    },
    {
      name: 'Accounts',
      path: '/admin/accounts',
      icon: LucideUser2,
      category: 'user-management',
      access: ['superadmin'],
    },
    {
      name: 'Departments',
      path: '/admin/departments',
      icon: LucideBuilding2,
      category: 'libraries',
      access: ['superadmin'],
    },
    {
      name: 'Categories',
      path: '/admin/categories',
      icon: LucideTags,
      category: 'libraries',
      access: ['superadmin'],
    },
    {
      name: 'Brands',
      path: '/admin/brands',
      icon: LucideAward,
      category: 'libraries',
      access: ['superadmin'],
    },
    {
      name: 'Locations',
      path: '/admin/locations',
      icon: LucideMapPin,
      category: 'libraries',
      access: ['superadmin'],
    },
    {
      name: 'Offices',
      path: '/admin/offices',
      icon: LucideBuilding,
      category: 'libraries',
      access: ['superadmin'],
    },
    {
      name: 'Suppliers',
      path: '/admin/suppliers',
      icon: LucideTruck,
      category: 'libraries',
      access: ['superadmin'],
    },
    {
      name: 'Roles',
      path: '/admin/roles',
      icon: LucideCog,
      category: 'user-management',
      access: ['superadmin'],
    },
    {
      name: 'Departments',
      path: '/admin/departments',
      icon: LucideBuilding2,
      category: 'user-management',
      access: ['superadmin'],
    },
    {
      name: 'Positions',
      path: '/admin/positions',
      icon: LucideUserRoundCog,
      category: 'user-management',
      access: ['superadmin'],
    },
  ];

  const filteredDirectories = visibleDirectories.filter((directory) =>
    directory.access.includes(userRole)
  );

  return (
    <aside
      ref={sideBarRef}
      className={`fixed top-0 left-0 z-10 h-full shrink-0 overflow-hidden border-r border-slate-200 bg-white shadow-lg transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 ${
        isSidebarExpanded ? 'w-[250px]' : 'w-0'
      }`}
    >
      <div className="shadow-b flex items-center justify-center border-slate-500 bg-slate-100 py-3 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-center">
          <div className="font-bold">{user?.username}</div>
          <div className="text-xs uppercase">{user?.role}</div>
        </div>
      </div>

      <nav className="flex flex-col border-t border-slate-200 py-4 dark:border-slate-800">
        {filteredDirectories
          .sort((a, b) => {
            // Home always comes first
            if (a.path === '/') return -1;
            if (b.path === '/') return 1;

            // More access = higher in the list
            return b.access.length - a.access.length;
          })
          .map((directory) => {
            return (
              <button
                key={directory.name}
                type="button"
                onClick={() => {
                  router.push(directory.path);
                }}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:translate-x-2 hover:bg-slate-100 hover:shadow-md dark:hover:bg-slate-800"
              >
                {directory.icon && <directory.icon size={20} />}

                <span className="text-sm">{directory.name}</span>
              </button>
            );
          })}
      </nav>
    </aside>
  );
}
