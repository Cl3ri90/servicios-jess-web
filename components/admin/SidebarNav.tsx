'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Settings,  
  Briefcase, 
  Layout, 
  Users, 
  BarChart3, 
  Zap,
  Target,
  FileCode2,
  Database,
  CheckSquare
} from 'lucide-react';
import type { AdminMenuLink } from '@/lib/admin/menu';

const ICON_MAP: Record<string, React.ReactNode> = {
  settings: <Settings className="w-4 h-4" />,
  tools: <Target className="w-4 h-4" />,
  briefcase: <Briefcase className="w-4 h-4" />,
  'check-square': <CheckSquare className="w-4 h-4" />,
  shield: <Users className="w-4 h-4" />,
  activity: <BarChart3 className="w-4 h-4" />,
  zap: <Zap className="w-4 h-4" />,
  database: <Database className="w-4 h-4" />,
  filecode2: <FileCode2 className="w-4 h-4" />,
  layout: <Layout className="w-4 h-4" />
};

export function SidebarNav({ 
  basePath, 
  flags, 
  isDeveloper = false,
  links = []
}: { 
  basePath: string;
  flags?: any;
  isDeveloper?: boolean;
  links?: AdminMenuLink[];
}) {
  const pathname = usePathname();
  const currentPath = pathname || basePath;
  const isHomeDashboard = currentPath === basePath;
  const dashboardLink = isDeveloper ? '/admin/developer' : '/admin/owner';

  return (
    <nav className="flex-1 flex flex-col gap-3 pr-2 overflow-y-auto">
      <Link 
        href={dashboardLink} 
        className={`flex items-center gap-3 p-2.5 rounded-sm transition-all text-sm font-medium uppercase tracking-wider ${
          currentPath === dashboardLink 
            ? 'text-zinc-100 bg-zinc-900 border border-zinc-800' 
            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
        }`}
      >
        <div className="w-4 h-4 flex items-center justify-center">
          <Layout className={`w-4 h-4 ${currentPath === dashboardLink ? 'text-[#ea580c]' : ''}`} />
        </div>
        {isDeveloper ? 'Command Center' : 'Resumen General'}
      </Link>

      <div className="flex flex-col gap-1 mt-4">
        <span className="text-[10px] text-zinc-600 font-mono tracking-widest uppercase mb-2 px-2">
          {isDeveloper ? 'Módulos Globales' : 'Módulos Operativos'}
        </span>
        
        <div className="flex flex-col gap-1 mt-1 border-l border-zinc-800 ml-4 py-1 pl-4">
          {links.map(link => {
            const isActive = currentPath.startsWith(link.href);
            const icon = ICON_MAP[link.icon] || <Layout className="w-4 h-4" />;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`p-2.5 rounded-sm text-sm transition-all flex items-center gap-3 group relative overflow-hidden font-mono text-[10px] sm:text-xs ${
                  isActive 
                    ? 'text-zinc-100 bg-[#ea580c]/5 border border-[#ea580c]/20' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-dot"
                    className="absolute left-0 w-0.5 h-4 bg-[#ea580c] rounded-full" 
                  />
                )}
                <span className={`${isActive ? 'text-[#ea580c]' : 'text-zinc-600 transition-colors'}`}>
                  {icon}
                </span>
                <span className="uppercase tracking-widest">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
