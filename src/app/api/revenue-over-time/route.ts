
import { esClient } from '@/lib/elasticsearch';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await esClient.search({
      index: 'kibana_sample_data_ecommerce',
      size: 0,
      body: {
        aggs: {
          revenue_over_time: {
            date_histogram: {
              field: 'order_date',
              calendar_interval: 'day'
            },
            aggs: {
              daily_revenue: { sum: { field: 'taxful_total_price' } }
            }
          }
        }
      }
    });

    const buckets = result.aggregations?.revenue_over_time?.buckets || [];
    const trend = buckets.map((bucket: any) => ({
      date: bucket.key_as_string,
      revenue: bucket.daily_revenue.value
    }));

    return NextResponse.json({ trend });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
