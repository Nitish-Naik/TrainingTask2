import { esClient } from '@/lib/elasticsearch';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Initial search with scroll
    const scrollTime = '1m'; // Scroll context timeout
    const initialResponse = await esClient.search({
      index: 'kibana_sample_data_ecommerce',
      scroll: scrollTime,
      body: {
        query: { match_all: {} },
        size: 1000, // Batch size
      },
    });

    let documents: any[] = initialResponse.hits.hits.map((hit: any) => ({
      id: hit._id,
      ...hit._source,
    }));
    let scrollId = initialResponse._scroll_id;

    // Continue scrolling until no more results
    while (true) {
      const scrollResponse = await esClient.scroll({
        scroll: scrollTime,
        scroll_id: scrollId,
      });

      const newDocs = scrollResponse.hits.hits.map((hit: any) => ({
        id: hit._id,
        ...hit._source,
      }));

      if (newDocs.length === 0) break; // No more documents
      documents = documents.concat(newDocs);
      scrollId = scrollResponse._scroll_id;
    }

    // Clear the scroll context
    await esClient.clearScroll({ scroll_id: scrollId });

    return NextResponse.json({ documents });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}