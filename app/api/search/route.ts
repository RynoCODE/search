import { NextRequest, NextResponse } from 'next/server';
import { searchDatabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Get search query from URL
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ 
        error: 'No search query provided' 
      }, { status: 400 });
    }
    
    // Search the database
    const results = await searchDatabase(query);
    
    // Prepare response with highlighted snippets
    const processedResults = results.map(result => {
      // Create a snippet from the content, focusing on the matched text
      const normalizedQuery = query.toLowerCase();
      const content = result.extractedContent.toLowerCase();
      let startIndex = content.indexOf(normalizedQuery);
      
      // If query not found in content, use the beginning
      if (startIndex === -1) startIndex = 0;
      
      // Get a context window around the query (100 chars before, 400 after)
      const snippetStart = Math.max(0, startIndex - 100);
      const snippetEnd = Math.min(content.length, startIndex + query.length + 400);
      let snippet = result.extractedContent.substring(snippetStart, snippetEnd);
      
      // Add ellipsis if we're not at the beginning/end
      if (snippetStart > 0) snippet = '...' + snippet;
      if (snippetEnd < content.length) snippet = snippet + '...';
      
      return {
        id: result.id,
        filename: result.filename,
        summary: result.summary,
        snippet,
        keywords: result.keywords,
        uploadDate: result.uploadDate
      };
    });
    
    return NextResponse.json({ 
      results: processedResults,
      count: processedResults.length
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error searching files:', error);
    return NextResponse.json({ 
      error: 'Failed to search files',
      details: (error as Error).message 
    }, { status: 500 });
  }
}
