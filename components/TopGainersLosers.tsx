import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetcher } from '@/lib/coingecko.actions';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const TopGainersLosers = async () => {
  let topGainersLosers;
  try {
    topGainersLosers = await fetcher<TopGainersLosers[]>('/coins/markets', {
      vs_currency: 'usd',
    });
  } catch (error) {
    console.error('Error fetching top gainers and losers:', error);
  }

  const topGainers = [...(topGainersLosers ?? [])]
    .sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
    )
    .slice(0, 5);

  const topLosers = [...(topGainersLosers ?? [])]
    .sort(
      (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h,
    )
    .slice(0, 5);

  const renderCoins = (coins: TopGainersLosers[]) =>
    coins.map((coin) => {
      const isTrendingUp = coin.price_change_percentage_24h > 0;

      return (
        <div className="coin-item" key={coin.id}>
          <div className="flex gap-2 w-full">
            <Image src={coin.image} alt={coin.name} width={48} height={48} />
            <div className="coin-info">
              <Link href={`/coins/${coin.id}`} className="font-semibold block">
                {coin.name}
              </Link>
              <span className="uppercase text-purple-100 text-sm">
                {coin.symbol}
              </span>
            </div>
          </div>

          <div className="coin-price">
            <p>{formatCurrency(coin.current_price)}</p>

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

              <p>{formatPercentage(coin.price_change_percentage_24h)}</p>
            </div>
          </div>
        </div>
      );
    });

  return (
    <div id="top-gainers-losers">
      <Tabs defaultValue="top-gainers">
        <TabsList className="tabs-list">
          <TabsTrigger value="top-gainers" className="tabs-trigger">
            <h4>Top Gainers</h4>
          </TabsTrigger>
          <TabsTrigger value="top-losers" className="tabs-trigger">
            <h4>Top Losers</h4>
          </TabsTrigger>
        </TabsList>
        <TabsContent className="tabs-content" value="top-gainers">
          {renderCoins(topGainers)}
        </TabsContent>
        <TabsContent className="tabs-content" value="top-losers">
          {renderCoins(topLosers)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TopGainersLosers;
