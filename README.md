# Local Document Search Engine

A comprehensive Next.js application for file upload, data extraction, summarization, and search functionality. This application enables users to upload various file types, automatically extracts and processes their content, and provides powerful search capabilities across all uploaded files.

## Features

- **File Upload**: Support for multiple file formats including PDF, DOCX, TXT, images, audio, and video
- **Content Extraction**: Intelligent parsing based on file type
  - Text extraction from documents (PDF, DOCX, TXT)
  - OCR for images
  - Speech-to-text for audio/video files (simplified implementation)
- **Text Processing**: 
  - Automatic summarization of extracted content
  - Keyword extraction for better searchability
- **Local Storage**: Files stored locally in the uploads directory
- **JSON Database**: Metadata and extracted content stored in a local JSON database
- **Fast Search**: Optimized search across all uploaded content

## Getting Started

First, install the dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to use the application.

## Project Structure

- `app/`: Next.js app router components and pages
  - `api/`: API routes for file upload and search
- `components/`: React components for UI
- `lib/`: Utility functions for file processing and database operations
- `uploads/`: Directory where uploaded files are stored
- `data/`: Directory where the JSON database is stored
- `public/`: Static assets

## Implementation Details

### File Upload

The application uses Next.js API routes with `multer` for handling file uploads. Files are stored in the `uploads` directory with unique IDs to prevent conflicts.

### Content Extraction

Based on file type, different extraction methods are used:
- PDF: Using `pdf-parse` library
- DOCX: Using `mammoth` library
- Images: Using `tesseract.js` for OCR
- Audio/Video: Using `ffmpeg` for audio extraction (simplified implementation)

### Text Processing

The application provides:
- Text summarization using extraction-based methods
- Keyword extraction using TF-IDF based approaches

### Search Functionality

The search implementation provides:
- Case-insensitive search
- Prioritized results (keywords > summary > content)
- Result snippets with context around matched text

## Limitations

- The audio/video transcription is simplified and would benefit from integration with proper STT services
- For large files or high volumes, consider implementing more efficient storage and indexing

## License

MIT

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
