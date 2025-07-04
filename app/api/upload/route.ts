import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import { processFile } from '@/lib/file-processor';
import { saveToDatabase } from '@/lib/database';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');

export async function POST(request: NextRequest) {
  try {
    // Create uploads directory if it doesn't exist
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Parse the incoming form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Generate a unique filename
    const uniqueId = nanoid();
    const originalName = file.name;
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${uniqueId}-${sanitizedName}`;
    const filePath = path.join(uploadsDir, fileName);
    
    // Convert the file to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Write the file to disk
    await writeFile(filePath, buffer);
    
    // Process the file to extract content, generate summary, and extract keywords
    const { extractedContent, summary, keywords } = await processFile(filePath);
    
    // Save to database
    const fileEntry = await saveToDatabase({
      filename: originalName,
      filepath: filePath,
      extractedContent,
      summary,
      keywords
    });
    
    return NextResponse.json({ 
      success: true, 
      file: fileEntry 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ 
      error: 'Failed to upload file', 
      details: (error as Error).message 
    }, { status: 500 });  }
}

// Configure API route for large file uploads
export const config = {
  api: {
    // Disable the default body parser
    bodyParser: false,
  },
  // Set a higher response limit for large files
  runtime: 'nodejs',
};
