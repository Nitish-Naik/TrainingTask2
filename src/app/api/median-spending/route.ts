import { esClient } from '@/lib/elasticsearch';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await esClient.search({
      index: 'kibana_sample_data_ecommerce',
      body: {
        query: { match_all: {} },
        _source: ['taxful_total_price'],
        size: 10000, // Fetch all documents (index has ~4,675 documents)
        sort: [{ taxful_total_price: 'asc' }],
      },
    });

    const prices = result.hits.hits.map((hit: any) => hit._source.taxful_total_price);
    const totalCount = prices.length;

    if (totalCount === 0) {
      return NextResponse.json({ medianSpending: 0 });
    }

    let medianSpending: number;
    if (totalCount % 2 === 0) {
      // Even number of documents: average the two middle values
      medianSpending = (prices[totalCount / 2 - 1] + prices[totalCount / 2]) / 2;
    } else {
      // Odd number of documents: take the middle value
      medianSpending = prices[Math.floor(totalCount / 2)];
    }

    return NextResponse.json({ medianSpending });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}