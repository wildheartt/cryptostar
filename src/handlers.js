import { rest } from 'msw';

export const handlers = [
  rest.get('https://coinranking1.p.rapidapi.com/coins', (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit'));
    const fakeCoins = Array.from({ length: limit }, (_, i) => ({
      uuid: `${i + 1}`,
      name: `Coin${i + 1}`,
      price: `${(i + 1) * 1000}`,
      rank: i + 1,
      iconUrl: `icon${i + 1}.png`,
      marketCap: `${(i + 1) * 100000}`,
      change: `${i}`,
    }));
    return res(ctx.status(200), ctx.json({ data: { coins: fakeCoins } }));
  }),

  rest.get('https://coinranking1.p.rapidapi.com/stats', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          total: 3000,
          totalExchanges: 100,
          totalMarketCap: '1500000000000',
          total24hVolume: '50000000000',
        },
      })
    );
  }),

  rest.get('https://coinranking1.p.rapidapi.com/coin/:coinId', (req, res, ctx) => {
    const { coinId } = req.params;
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          coin: {
            uuid: coinId,
            name: `Coin${coinId}`,
            description: `Описание Coin${coinId}`,
            price: `${Number(coinId) * 1000}`,
            marketCap: `${Number(coinId) * 100000}`,
            change: `${coinId}`,
            websiteUrl: 'https://example.com',
            links: [{ type: 'website', url: 'https://example.com' }],
          },
        },
      })
    );
  }),

  rest.get('https://coinranking1.p.rapidapi.com/coin/:coinId/history', (req, res, ctx) => {
    const { coinId } = req.params;
    const period = req.url.searchParams.get('timePeriod') || '7d';
    // сгенерим фиктивные точки графика
    const history = Array.from({ length: 7 }, (_, i) => ({
      price: `${Number(coinId) * 1000 + i * 10}`,
      timestamp: Date.now() - i * 24 * 60 * 60 * 1000,
    }));
    return res(ctx.status(200), ctx.json({ data: { change: '5', history } }));
  }),

  rest.get('https://coinranking1.p.rapidapi.com/exchanges', (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit') ?? 10);
    const fakeExchanges = Array.from({ length: limit }, (_, i) => ({
      uuid: `${i + 1}`,
      name: `Exchange${i + 1}`,
      rank: i + 1,
      iconUrl: `exch${i + 1}.png`,
      numberOfMarkets: 100 + i,
      volume: `${(i + 1) * 10000000}`,
    }));
    return res(ctx.status(200), ctx.json({ data: { stats: {}, exchanges: fakeExchanges } }));
  }),

  rest.get('https://coinranking1.p.rapidapi.com/news', (req, res, ctx) => {
    const { _limit = 10, _start = 0 } = req.url.searchParams;
    const news = Array.from({ length: _limit }, (_, i) => ({
      id: i + 1,
      title: `Новость ${i + 1}`,
      description: `Описание новости ${i + 1}`,
      url: `https://example.com/news/${i + 1}`,
      image: `https://picsum.photos/200/300?random=${i + 1}`,
      publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
      source: {
        name: 'Crypto News',
        url: 'https://example.com',
      },
    }));

    return res(
      ctx.status(200),
      ctx.json({
        data: news,
        meta: {
          pagination: {
            total: 100,
            count: _limit,
            per_page: _limit,
            current_page: Math.floor(_start / _limit) + 1,
            total_pages: Math.ceil(100 / _limit),
            links: {
              previous: _start > 0 ? `?limit=${_limit}&start=${_start - _limit}` : null,
              current: `?limit=${_limit}&start=${_start}`,
              next: _start + _limit < 100 ? `?limit=${_limit}&start=${_start + _limit}` : null,
            },
          },
        },
      })
    );
  }),
];
