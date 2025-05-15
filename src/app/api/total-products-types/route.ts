import { esClient } from '@/lib/elasticsearch';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await esClient.search({
      index: 'kibana_sample_data_ecommerce',
      body: {
        query: { match_all: {} },
        aggs: {
          unique_categories: {
            terms: {
              field: 'category.keyword',
              size: 100, // Should cover all categories
            },
          },
        },
        size: 0,
      },
    });

    const categories = result.aggregations.unique_categories.buckets.map((bucket: any) => bucket.key);
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}