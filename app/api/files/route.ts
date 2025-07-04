import { NextResponse } from 'next/server';
import { getAllEntries } from '@/lib/database';

export async function GET() {
  try {
    // Get all file entries from the database
    const files = await getAllEntries();
    
    return NextResponse.json({ files }, { status: 200 });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch files',
      details: (error as Error).message 
    }, { status: 500 });
  }
}
