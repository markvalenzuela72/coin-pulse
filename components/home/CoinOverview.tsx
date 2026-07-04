import React from 'react';
import { fetcher } from '@/lib/coingecko.actions';
import { CoinOverviewFallback } from './fallback';
import CandlestickChart from '@/components/CandlestickChart';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

const getCoinData = async () => {
  const [coin, coinOHLCData] = await Promise.all([
    fetcher<CoinDetailsData>('/coins/bitcoin', {
      dex_pair_format: 'symbol',
    }).catch(() => null),

    fetcher<OHLCData[]>('/coins/bitcoin/ohlc', {
      vs_currency: 'usd',
      days: 1,
      precision: 'full',
    }).catch(() => []),
  ]);

  return { coin, coinOHLCData };
};

const CoinOverview = async () => {
  const { coin, coinOHLCData } = await getCoinData();

  if (!coin) {
    return <CoinOverviewFallback />;
  }

  return (
    <div id="coin-overview">
      <CandlestickChart data={coinOHLCData} coinId="bitcoin">
        <div className="header pt-2">
          <Image
            src={coin.image.large}
            alt={coin.name}
            width={56}
            height={56}
          />
          <div className="info">
            <p>
              {coin.name} / {coin.symbol.toUpperCase()}
            </p>
            <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
          </div>
        </div>
      </CandlestickChart>
    </div>
  );
};

export default CoinOverview;
