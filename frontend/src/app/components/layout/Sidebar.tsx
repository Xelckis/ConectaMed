import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  Calendar,
  History,
  Users,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  Heart
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../ui/Button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Agenda', href: '/agenda', icon: Calendar },
  { name: 'Histórico', href: '/historico', icon: History },
  { name: 'Rede de Apoio', href: '/rede-apoio', icon: Users },
  { name: 'Perfil', href: '/perfil', icon: User },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-lg"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div
        className={cn(
          'fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity',
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 w-72 bg-sidebar border-r border-sidebar-border',
          'flex flex-col transition-transform lg:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">ConectaMed</h1>
              <p className="text-xs text-muted-foreground">Cuidado conectado</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/30 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-medium">
              {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </Button>
        </div>
      </aside>
    </>
  );
}
