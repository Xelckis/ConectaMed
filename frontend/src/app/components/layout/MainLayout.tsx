import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNavigation } from './BottomNavigation';
import { Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useNavigate } from 'react-router';
import { mockNotifications } from '../../data/mockData';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-end gap-4 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            onClick={() => navigate('/notificacoes')}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          {children}
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
}
