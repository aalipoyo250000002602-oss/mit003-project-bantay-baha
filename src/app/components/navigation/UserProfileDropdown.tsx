import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ChevronDown, User, Shield, Settings, LogOut } from 'lucide-react';
import { userProfile } from '../data/navigationData';
import { getInitials } from '../utils/navigationUtils';

interface UserProfileDropdownProps {
  onOpenProfile?: () => void;
}

export function UserProfileDropdown({ onOpenProfile }: UserProfileDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-3 hover:bg-accent hover:text-accent-foreground transition-colors h-10 px-3"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={userProfile.avatar} />
            <AvatarFallback>{getInitials(userProfile.name)}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-foreground">{userProfile.name}</p>
            <p className="text-xs text-muted-foreground">{userProfile.role}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-popover border-border">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfile.avatar} />
              <AvatarFallback>{getInitials(userProfile.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{userProfile.name}</p>
              <p className="text-xs text-muted-foreground">{userProfile.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
          onClick={onOpenProfile}
        >
          <User className="mr-2 h-4 w-4" />
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
          <Shield className="mr-2 h-4 w-4" />
          Security
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
          <Settings className="mr-2 h-4 w-4" />
          Preferences
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}