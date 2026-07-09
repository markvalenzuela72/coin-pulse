'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from './ui/button';
import { fetcher, searchCoins } from '@/lib/coingecko.actions';
import { Search as SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import useSWR from 'swr';
import { useDebounce, useKey } from 'react-use';

const TRENDING_LIMIT = 8;
const SEARCH_LIMIT = 20;

const SearchItem = ({ coin, onSelect, isActiveName }: SearchItemProps) => {
  return (
    <CommandItem
      value={coin.id}
      onSelect={() => onSelect(coin.id)}
      className="search-item"
    >
      <div className="coin-info">
        <Image src={coin.thumb} alt={coin.name} width={40} height={40} />

        <div>
          <p className={cn('font-bold', isActiveName && 'text-white')}>
            {coin.name}
          </p>
          <p className="coin-symbol">{coin.symbol}</p>
        </div>
      </div>
    </CommandItem>
  );
};
export async function getTrendingCoins(): Promise<TrendingCoin[]> {
  const res = await fetcher<{ coins: TrendingCoin[] }>(
    '/search/trending',
    undefined,
    300,
  );

  return res.coins;
}

const SearchModal = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const { data: initialTrendingCoins = [] } = useSWR(
    'trending-coins',
    getTrendingCoins,
    {
      revalidateOnFocus: false,
    },
  );

  useDebounce(
    () => {
      setDebouncedQuery(searchQuery.trim());
    },
    300,
    [searchQuery],
  );

  const {
    data: searchResults = [],
    isValidating: isSearching,
    error: searchError,
  } = useSWR<SearchCoin[]>(
    debouncedQuery ? ['coin-search', debouncedQuery] : null,
    ([, query]) => searchCoins(query as string),
    {
      revalidateOnFocus: false,
    },
  );

  useKey(
    (event) =>
      event.key?.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey),
    (event) => {
      event.preventDefault();
      setOpen((prev) => !prev);
    },
    {},
    [setOpen],
  );

  const handleSelect = (coinId: string) => {
    setOpen(false);
    setSearchQuery('');
    setDebouncedQuery('');
    router.push(`/coins/${coinId}`);
  };

  const hasQuery = debouncedQuery.length > 0;
  const trendingCoins = initialTrendingCoins.slice(0, TRENDING_LIMIT);
  const showTrending = !hasQuery && trendingCoins.length > 0;

  const isSearchEmpty = !isSearching && !hasQuery && !showTrending;
  const isTrendingListVisible = !isSearching && showTrending;

  const isNoResults = !isSearching && hasQuery && searchResults.length === 0;
  const isResultsVisible = !isSearching && hasQuery && searchResults.length > 0;

  return (
    <div id="search-modal">
      <Button variant="ghost" onClick={() => setOpen(true)} className="trigger">
        <SearchIcon size={18} />
        Search
        <kbd className="kbd">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="dialog"
        data-search-modal
      >
        <div className="cmd-input">
          <CommandInput
            placeholder="Search for a token by name or symbol..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
        </div>

        <CommandList className="list custom-scrollbar">
          {isSearching && <div className="empty">Searching...</div>}

          {isSearchEmpty && (
            <div className="empty">Type to search for coins...</div>
          )}

          {isTrendingListVisible && (
            <CommandGroup className="group">
              {trendingCoins.map(({ item }) => (
                <SearchItem
                  key={item.id}
                  coin={item}
                  onSelect={handleSelect}
                  isActiveName={false}
                />
              ))}
            </CommandGroup>
          )}
          {(searchError || isNoResults) && (
            <CommandEmpty>
              {searchError
                ? 'Failed to load results. Please try again.'
                : 'No coins found.'}
            </CommandEmpty>
          )}

          {isResultsVisible && (
            <CommandGroup
              heading={<p className="heading">Search Results</p>}
              className="group"
            >
              {searchResults.slice(0, SEARCH_LIMIT).map((coin) => (
                <SearchItem
                  key={coin.id}
                  coin={coin}
                  onSelect={handleSelect}
                  isActiveName
                />
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default SearchModal;
