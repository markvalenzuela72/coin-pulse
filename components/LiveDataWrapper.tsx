'use client';

import { Separator } from '@/components/ui/separator';
import CandlestickChart from '@/components/CandlestickChart';
import { useCoinGeckoWebSocket } from '@/hooks/useCoinGeckoWebSocket';
import DataTable from '@/components/DataTable';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { useState } from 'react';
import CoinHeader from './CoinHeader';
import Link from 'next/link';
// import CoinHeader from '@/components/CoinHeader';

const LiveDataWrapper = ({
  children,
  coinId,
  poolId,
  coin,
  coinOHLCData,
}: LiveDataProps) => {
  const [liveInterval, setLiveInterval] = useState<'1s' | '1m'>('1s');
  const { trades, ohlcv, price } = useCoinGeckoWebSocket({
    coinId,
    poolId,
    liveInterval,
  });

  const tradeColumns: DataTableColumn<Trade>[] = [
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: (trade) => (trade.price ? formatCurrency(trade.price) : '-'),
    },
    {
      header: 'Amount',
      cellClassName: 'amount-cell',
      cell: (trade) => trade.amount?.toFixed(4) ?? '-',
    },
    {
      header: 'Value',
      cellClassName: 'value-cell',
      cell: (trade) => (trade.value ? formatCurrency(trade.value) : '-'),
    },
    {
      header: 'Buy/Sell',
      cellClassName: 'type-cell',
      cell: (trade) => (
        <span
          className={trade.type === 'b' ? 'text-green-500' : 'text-red-500'}
        >
          {trade.type === 'b' ? 'Buy' : 'Sell'}
        </span>
      ),
    },
    {
      header: 'Time',
      cellClassName: 'time-cell',
      cell: (trade) => (trade.timestamp ? timeAgo(trade.timestamp) : '-'),
    },
  ];

  const exchangeColumns: DataTableColumn<Ticker>[] = [
    {
      header: 'Exchange',
      cellClassName: 'exchange-name',
      cell: (exchange) => (
        <>
          {exchange.market.name ? exchange.market.name : '-'}
          <Link href={exchange.trade_url} target="_blank" />
        </>
      ),
    },
    {
      header: 'Pair',
      cellClassName: 'pair',
      cell: (exchange) => (
        <p>
          {exchange.base} / {exchange.target}
        </p>
      ),
    },
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: (exchange) =>
        exchange.converted_last.usd
          ? formatCurrency(exchange.converted_last.usd)
          : '-',
    },
    {
      header: 'Last Traded',
      headClassName: 'text-end',
      cellClassName: 'time-cell',
      cell: (exchange) =>
        exchange.timestamp ? timeAgo(exchange.timestamp) : '-',
    },
  ];

  const recentExchanges = coin.tickers.slice(0, 10);
  return (
    <section id="live-data-wrapper">
      <CoinHeader
        name={coin.name}
        image={coin.image.large}
        livePrice={price?.usd ?? coin.market_data.current_price.usd}
        livePriceChangePercentage24h={
          price?.change24h ??
          coin.market_data.price_change_percentage_24h_in_currency.usd
        }
        priceChangePercentage30d={
          coin.market_data.price_change_percentage_30d_in_currency.usd
        }
        priceChange24h={coin.market_data.price_change_24h_in_currency.usd}
      />
      <Separator className="divider" />

      <div className="trend">
        <CandlestickChart
          coinId={coinId}
          data={coinOHLCData}
          liveOhlcv={ohlcv}
          mode="live"
          initialPeriod="daily"
          liveInterval={liveInterval}
          setLiveInterval={setLiveInterval}
        >
          <h4>Trend Overview</h4>
        </CandlestickChart>
      </div>

      <Separator className="divider" />

      {tradeColumns && (
        <div className="trades">
          <h4>Recent Trades</h4>

          <DataTable
            columns={tradeColumns}
            data={trades}
            rowKey={(_, index) => index}
            tableClassName="trades-table"
          />
        </div>
      )}
      <Separator className="divider" />
      {exchangeColumns && (
        <div className="exchange-section">
          <h4>Exchange Listings</h4>
          <DataTable
            columns={exchangeColumns}
            data={recentExchanges}
            rowKey={(_, index) => index}
            tableClassName="exchange-table"
          />
        </div>
      )}
    </section>
  );
};

export default LiveDataWrapper;
