<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# File Upload, Processing, and Search Engine

This is a Next.js application that handles file uploads, extracts content from various file formats, summarizes text, and provides search capabilities.

## Project Structure
- `app/`: Next.js app router components and pages
- `app/api/`: API routes for file upload and search
- `components/`: React components
- `lib/`: Utility functions for file processing and database operations
- `uploads/`: Directory where uploaded files are stored
- `data/`: Directory where the JSON database is stored

## Key Features
- File upload with progress indication
- Content extraction from various file types (PDF, DOCX, TXT, images, audio, video)
- Text summarization and keyword extraction
- Local JSON database storage
- Fast search functionality