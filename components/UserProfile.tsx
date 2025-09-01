'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 p-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="flex items-center gap-3 p-2">
      <Avatar className="w-8 h-8">
        <AvatarImage
          src={session.user.image || ''}
          alt={session.user.name || 'User'}
        />
        <AvatarFallback>
          {session.user.name ? (
            session.user.name.charAt(0).toUpperCase()
          ) : (
            <User className="w-4 h-4" />
          )}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-gray-900 truncate">
          {session.user.name || 'User'}
        </span>
        <span className="text-xs text-gray-500 truncate">
          {session.user.email}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        className="ml-auto p-1 h-8 w-8"
        title="Sign out"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
}




