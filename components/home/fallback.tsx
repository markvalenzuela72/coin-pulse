import React from 'react';
import DataTable from '@/components/DataTable';

export const CoinOverviewFallback = () => {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2 animate-pulse">
        <div className="header-image bg-dark-400" />
        <div className="info">
          <div className="header-line-sm bg-dark-400 rounded-md" />
          <div className="header-line-lg bg-dark-400 rounded-md" />
        </div>
      </div>
      <div className="flex gap-2 mb-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="period-button-skeleton bg-dark-400" />
        ))}
      </div>
      <div className="chart animate-pulse">
        <div className="chart-skeleton bg-dark-400" />
      </div>
    </div>
  );
};

const trendingColumns: DataTableColumn<any>[] = [
  {
    header: 'Name',
    cellClassName: 'name-cell',
    cell: () => (
      <div className="name-link animate-pulse">
        <div className="name-image bg-dark-400" />
        <div className="name-line bg-dark-400 rounded-md" />
      </div>
    ),
  },
  {
    header: '24h Change',
    cellClassName: 'change-cell',
    cell: () => (
      <div className="price-change animate-pulse">
        <div className="change-icon bg-dark-400" />
        <div className="change-line bg-dark-400 rounded-md" />
      </div>
    ),
  },
  {
    header: 'Price',
    cellClassName: 'price-cell',
    cell: () => (
      <div className="price-line bg-dark-400 rounded-md animate-pulse" />
    ),
  },
];

export const TrendingCoinsFallback = () => {
  const skeletonData = [...Array(6)].map((_, i) => ({ id: i }));

  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      <div className="trending-coins-table">
        <DataTable
          data={skeletonData}
          columns={trendingColumns}
          rowKey={(item) => item.id}
          tableClassName="trending-coins-table"
          headerClassName="py-3!"
          bodyCellClassName="py-2!"
        />
      </div>
    </div>
  );
};
