import { useUserContext } from '@/context/UserContext';
import axiosInstance from '@/lib/axiosInstance';
import * as Lucide from 'lucide-react';
import {
  LucideAward,
  LucideBarChart4,
  LucideBuilding,
  LucideBuilding2,
  LucideCog,
  LucideHome,
  LucideMapPin,
  LucideMonitorCog,
  LucideTags,
  LucideTruck,
  LucideUserCog,
  LucideUsers,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type Role = 'superadmin' | 'admin' | 'user';

type Directory = {
  name: string;
  path: string;
  icon: React.ElementType;
  access: Role[];
};

interface SidebarLinks {
  id: number;
  name: string;
  path: string;
  icon: string;
  access: string[];
}

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
  const { isAuthenticated } = useUserContext();

  const [sidebarLinks, setSidebarLinks] = useState<SidebarLinks[]>([]);

  const directories: Directory[] = sidebarLinks.map((sidebar: any) => {
    return {
      ...sidebar,
      access: sidebar?.sidebarLinkRoles?.map((role: any) => role.role.role),
    };
  });

  const visibleDirectories = directories.filter((directory) =>
    directory.access.includes(userRole)
  );

  const fetchSidebarLinks = useCallback(async () => {
    const response = await axiosInstance.get('/sidebar-management');
    setSidebarLinks(response.data);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSidebarLinks();
    }
  }, [fetchSidebarLinks, isAuthenticated]);

  return (
    <aside
      ref={sideBarRef}
      className={`fixed top-0 left-0 z-10 h-full shrink-0 overflow-hidden border-r border-slate-200 bg-white shadow-lg transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 ${
        isSidebarExpanded ? 'w-[250px]' : 'w-0'
      }`}
    >
      <div className="border-b border-slate-500 bg-slate-100 py-6 dark:border-slate-800 dark:bg-slate-900" />

      <nav className="flex flex-col border-t border-slate-200 py-4 dark:border-slate-800">
        {visibleDirectories
          .sort((a, b) => {
            // Home always comes first
            if (a.path === '/') return -1;
            if (b.path === '/') return 1;

            // More access = higher in the list
            return b.access.length - a.access.length;
          })
          .map((directory) => {
            const Icon = Lucide[directory.icon as keyof typeof Lucide];

            return (
              <button
                key={directory.name}
                type="button"
                onClick={() => {
                  router.push(directory.path);
                  console.log(directory.path);
                }}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {Icon && <Icon size={20} />}

                <span className="text-sm">{directory.name}</span>
              </button>
            );
          })}
      </nav>
    </aside>
  );
}
