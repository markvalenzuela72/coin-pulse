import DataTable from '@/components/DataTable';
import { fetcher } from '@/lib/coingecko.actions';
import Image from 'next/image';
import Link from 'next/link';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

const columns: DataTableColumn<TrendingCoin>[] = [
  {
    header: 'Name',
    cellClassName: 'name-cell',
    cell: (coin) => {
      const item = coin.item;

      return (
        <Link href={`/coins/${item.id}`} className="flex items-center gap-2">
          <Image src={item.large} alt={item.name} width={36} height={36} />
          <p>{item.name}</p>
        </Link>
      );
    },
  },
  {
    header: '24h Change',
    cellClassName: 'name-cell',
    cell: (coin) => {
      const item = coin.item;
      const isTrendingUp = item.data.price_change_percentage_24h.usd > 0;

      return (
        <div
          className={cn(
            'price-change flex items-center gap-1',
            isTrendingUp ? 'text-green-500' : 'text-red-500',
          )}
        >
          {isTrendingUp ? (
            <TrendingUp width={16} height={16} />
          ) : (
            <TrendingDown width={16} height={16} />
          )}
          <p>{item.data.price_change_percentage_24h.usd.toFixed(2)}%</p>
        </div>
      );
    },
  },
  {
    header: 'Price',
    cellClassName: 'price-cell',
    cell: (coin) => formatCurrency(coin.item.data.price),
  },
];

const TrendingCoins = async () => {
  const trendingCoins = await fetcher<{ coins: TrendingCoin[] }>(
    '/search/trending',
    undefined,
    300,
  );
  return (
    <div id="trending-coins">
      <h4>Trending Coins</h4>
      <div id="trending-coins">
        <DataTable
          data={trendingCoins.coins.slice(0, 6) || []}
          columns={columns}
          rowKey={(coin) => coin.item.id}
          tableClassName="trending-coins-table"
          headerClassName="py-3!"
          bodyCellClassName="py-2!"
        />
      </div>
    </div>
  );
};
export default TrendingCoins;
