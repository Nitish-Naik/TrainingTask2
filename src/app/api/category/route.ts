
import { esClient } from '@/lib/elasticsearch';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await esClient.search({
      index: 'kibana_sample_data_ecommerce',
      size: 0,
      body: {
        aggs: {
          category_breakdown: {
            terms: {
              field: 'category.keyword',
              size: 10
            },
            aggs: {
              total_revenue: {
                sum: { field: 'taxful_total_price' }
              }
            }
          }
        }
      }
    });

    const buckets = result.aggregations?.category_breakdown?.buckets || [];
    const categories = buckets.map((bucket: any) => ({
      category: bucket.key,
      revenue: bucket.total_revenue.value,
      transactions: bucket.doc_count
    }));

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
