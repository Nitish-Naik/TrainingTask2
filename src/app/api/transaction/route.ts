
import { esClient } from '@/lib/elasticsearch';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await esClient.search({
      index: 'kibana_sample_data_ecommerce',
      size: 0,
      body: {
        aggs: {
          tx_per_day: {
            date_histogram: {
              field: 'order_date',
              calendar_interval: 'day'
            }
          }
        }
      }
    });

    const buckets = result.aggregations?.tx_per_day?.buckets || [];
    const transactions = buckets.map((bucket: any) => ({
      date: bucket.key_as_string,
      count: bucket.doc_count
    }));

    return NextResponse.json({ transactions });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
