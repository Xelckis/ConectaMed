import { NavLink } from 'react-router';
import { LayoutDashboard, Calendar, History, Users, User } from 'lucide-react';
import { cn } from '../../../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Agenda', href: '/agenda', icon: Calendar },
  { name: 'Histórico', href: '/historico', icon: History },
  { name: 'Rede', href: '/rede-apoio', icon: Users },
  { name: 'Perfil', href: '/perfil', icon: User },
];

export function BottomNavigation() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 safe-area-inset-bottom">
      <div className="grid grid-cols-5 h-16">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 text-xs transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('w-5 h-5', isActive && 'fill-current')} />
                <span className="font-medium">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
