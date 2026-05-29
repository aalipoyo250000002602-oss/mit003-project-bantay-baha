import { useState } from 'react';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Search } from 'lucide-react';
import { searchData } from '../data/navigationData';
import { getSearchIcon } from '../utils/navigationUtils';

interface SearchCommandProps {
  onItemSelect?: (item: any) => void;
}

export function SearchCommand({ onItemSelect }: SearchCommandProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSearch = searchData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemSelect = (item: any) => {
    setSearchOpen(false);
    setSearchQuery('');
    onItemSelect?.(item);
  };

  return (
    <div className="flex-1 max-w-2xl mx-8">
      <Popover open={searchOpen} onOpenChange={setSearchOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search vehicles, trips, routes, drivers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              className="pl-10 pr-4 h-10 bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-ring/20 transition-all"
            />
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-xs font-mono text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-popover border-border" align="start">
          <Command>
            <CommandInput 
              placeholder="Search..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="border-0"
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Quick Results">
                {filteredSearch.map((item) => (
                  <CommandItem 
                    key={item.id} 
                    className="flex items-center gap-3 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    onSelect={() => handleItemSelect(item)}
                  >
                    {getSearchIcon(item.type)}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}