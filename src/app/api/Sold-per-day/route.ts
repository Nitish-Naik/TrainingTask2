
import { esClient } from '@/lib/elasticsearch';
import { NextResponse } from 'next/server';
import dayjs from 'dayjs';

export async function GET() {
  try {
    const today = dayjs();
    const sevenDaysAgo = today.subtract(6, 'day'); 

    const result = await esClient.search({
      index: 'kibana_sample_data_ecommerce',
      size: 0,
      body: {
        query: {
          range: {
            order_date: {
              gte: sevenDaysAgo.toISOString(),
              lte: today.toISOString()
            }
          }
        },
        aggs: {
          sold_per_day: {
            date_histogram: {
              field: 'order_date',
              calendar_interval: 'day'
            },
            aggs: {
              total_items: {
                sum: {
                  field: 'total_quantity'
                }
              }
            }
          }
        }
      }
    });

    const buckets = result.aggregations?.sold_per_day?.buckets || [];

    const dailySums = buckets.map((bucket: any) => bucket.total_items.value || 0);
    const averageSoldPerDay =
      dailySums.length > 0
        ? Number((dailySums.reduce((a, b) => a + b, 0) / dailySums.length).toFixed(2))
        : 0;

    return NextResponse.json({ averageSoldPerDay });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
