import { esClient } from '@/lib/elasticsearch';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await esClient.search({
      index: 'kibana_sample_data_ecommerce',
      body: {
        query: { match_all: {} },
        aggs: {
          total_revenue: {
            sum: { field: 'taxful_total_price' },
          },
        },
        size: 0,
      },
    });

    // Safely access the total_revenue value
    const totalRevenue = result.aggregations?.total_revenue?.value;

    if (totalRevenue === undefined) {
      return NextResponse.json(
        { error: 'Aggregation result is undefined' },
        { status: 500 }
      );
    }

    return NextResponse.json({ totalRevenue });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}