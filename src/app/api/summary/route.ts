
import { esClient } from '@/lib/elasticsearch';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await esClient.search({
      index: 'kibana_sample_data_ecommerce',
      size: 0,
      body: {
        aggs: {
          total_revenue: { sum: { field: 'taxful_total_price' } }
        }
      }
    });

    const revenue = result.aggregations?.total_revenue?.value || 0;
    return NextResponse.json({ revenue });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
