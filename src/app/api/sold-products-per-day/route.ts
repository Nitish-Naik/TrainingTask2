import { esClient } from '@/lib/elasticsearch';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await esClient.search({
      index: 'kibana_sample_data_ecommerce',
      body: {
        query: { match_all: {} },
        aggs: {
          by_day: {
            date_histogram: {
              field: 'order_date',
              calendar_interval: 'day',
            },
            aggs: {
              total_items: {
                sum: { field: 'total_quantity' },
              },
            },
          },
        },
        size: 0,
      },
    });
    const soldPerDay = result.aggregations.by_day.buckets.map((bucket: any) => ({
      date: bucket.key_as_string,
      totalItems: bucket.total_items.value,
    }));
    return NextResponse.json({ soldPerDay });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}