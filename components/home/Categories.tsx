import { fetcher } from '@/lib/coingecko.actions';
import DataTable from '../DataTable';
import { CategoriesFallback } from './fallback';
import Image from 'next/image';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';

const TopCategories = async () => {
  const columns: DataTableColumn<Category>[] = [
    {
      header: 'Name',
      cellClassName: 'category-cell',
      cell: (category) => category.name,
    },
    {
      header: 'Top Gainers',
      cellClassName: 'top-gainers-cell',
      cell: (category) => {
        return category.top_3_coins.map((coin, index) => (
          <Image
            key={category.top_3_coins[index]}
            src={coin}
            alt={category.top_3_coins[index]}
            width={24}
            height={24}
          />
        ));
      },
    },
    {
      header: '24h Change',
      cellClassName: 'change-header-cell ',
      cell: (category) => {
        const isTrendingUp = category.market_cap_change_24h > 0;

        return (
          <div
            className={cn(
              'change-cell flex items-center gap-1',
              isTrendingUp ? 'text-green-500' : 'text-red-500',
            )}
          >
            {isTrendingUp ? (
              <TrendingUp width={16} height={16} />
            ) : (
              <TrendingDown width={16} height={16} />
            )}
            <p>{formatPercentage(category.market_cap_change_24h)}</p>
          </div>
        );
      },
    },
    {
      header: 'Market Cap',
      cellClassName: 'market-cap-cell',
      cell: (category) => formatCurrency(category.market_cap),
    },
    {
      header: '24h Volume',
      cellClassName: 'volume-cell',
      cell: (category) => formatCurrency(category.volume_24h),
    },
  ];

  let topCategories;
  try {
    topCategories = await fetcher<Category[]>(
      '/coins/categories',
      undefined,
      300,
    );
  } catch (error) {
    console.error('Error fetching top categories:', error);
    return <CategoriesFallback />;
  }

  return (
    <div id="categories" className="custom-scrollbar">
      <h4>Top Categories</h4>
      <DataTable
        data={topCategories.slice(0, 10)}
        columns={columns}
        rowKey={(category) => category.name}
        tableClassName="mt-3"
      />
    </div>
  );
};

export default TopCategories;
