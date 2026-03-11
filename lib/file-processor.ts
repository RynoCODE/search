import fs from 'fs-extra';
import path from 'path';
import { nanoid } from 'nanoid';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { createSummary } from './summarizer';
import { extractKeywords } from './keyword-extractor';

// Configure ffmpeg with the installed path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Define the uploads directory path
const uploadsDir = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
fs.ensureDirSync(uploadsDir);

/**
 * Save the uploaded file to the uploads directory
 * @param {File} file - The uploaded file
 * @returns {Promise<string>} - The saved file path
 */
export async function saveUploadedFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const uniqueId = nanoid();
  const fileName = uniqueId + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = path.join(uploadsDir, fileName);
  
  await fs.writeFile(filePath, buffer);
  return filePath;
}

/**
 * Get file type from file path
 * @param {string} filePath - The path to the file
 * @returns {string} - The file type
 */
export function getFileType(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  
  // Text document types
  if (['.pdf'].includes(extension)) return 'pdf';
  if (['.docx', '.doc'].includes(extension)) return 'doc';
  if (['.txt', '.md', '.rtf'].includes(extension)) return 'text';
  
  // Image types
  if (['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff'].includes(extension)) return 'image';
  
  // Audio types
  if (['.mp3', '.wav', '.ogg', '.m4a', '.flac'].includes(extension)) return 'audio';
  
  // Video types
  if (['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv'].includes(extension)) return 'video';
  
  // Default
  return 'unknown';
}

/**
 * Extract text content from a PDF file
 * @param {string} filePath - The path to the PDF file
 * @returns {Promise<string>} - The extracted text
 */
export async function extractTextFromPdf(filePath: string): Promise<string> {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text || '';
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return '';
  }
}

/**
 * Extract text content from a DOC/DOCX file
 * @param {string} filePath - The path to the DOC file
 * @returns {Promise<string>} - The extracted text
 */
export async function extractTextFromDoc(filePath: string): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || '';
  } catch (error) {
    console.error('Error extracting text from DOC:', error);
    return '';
  }
}

/**
 * Extract text content from a plain text file
 * @param {string} filePath - The path to the text file
 * @returns {Promise<string>} - The extracted text
 */
export async function extractTextFromTextFile(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    console.error('Error extracting text from text file:', error);
    return '';
  }
}

/**
 * Extract text from images using OCR
 * @param {string} filePath - The path to the image
 * @returns {Promise<string>} - The extracted text
 */
export async function extractTextFromImage(filePath: string): Promise<string> {
  try {
    const { data } = await Tesseract.recognize(
      filePath,
      'eng', // English language
      { logger: m => console.log(m) } // Optional logger
    );
    return data.text || '';
  } catch (error) {
    console.error('Error extracting text from image:', error);
    return '';
  }
}

/**
 * Extract audio from a video file and save it as WAV
 * @param {string} filePath - The path to the video file
 * @returns {Promise<string>} - The path to the extracted audio file
 */
export async function extractAudioFromVideo(filePath: string): Promise<string> {
  const audioPath = filePath + '.wav';
  
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .output(audioPath)
      .audioCodec('pcm_s16le')
      .toFormat('wav')
      .on('end', () => resolve(audioPath))
      .on('error', (err) => {
        console.error('Error extracting audio from video:', err);
        reject(err);
      })
      .run();
  });
}

/**
 * Convert audio file to WAV format if it's not already
 * @param {string} filePath - The path to the audio file
 * @returns {Promise<string>} - The path to the WAV audio file
 */
export async function convertAudioToWav(filePath: string): Promise<string> {
  const wavPath = filePath + '.wav';
  
  // If already a WAV file, just return the path
  if (path.extname(filePath).toLowerCase() === '.wav') {
    return filePath;
  }
  
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .output(wavPath)
      .audioCodec('pcm_s16le')
      .audioChannels(1)
      .audioFrequency(16000)
      .toFormat('wav')
      .on('end', () => resolve(wavPath))
      .on('error', (err) => {
        console.error('Error converting audio to WAV:', err);
        reject(err);
      })
      .run();
  });
}

/**
 * Extract text from audio or video files using WhisperAI
 * Note: This is a simplified example. In a production environment,
 * you might want to use a dedicated API or a more robust solution.
 * @param {string} filePath - The path to the audio/video file
 * @returns {Promise<string>} - The transcribed text
 */
export async function extractTextFromAudioVideo(filePath: string): Promise<string> {
  try {
    // For audio files, convert to WAV format first
    const fileType = getFileType(filePath);
    
    if (fileType === 'video') {
      await extractAudioFromVideo(filePath);
    } else if (fileType === 'audio') {
      await convertAudioToWav(filePath);
    } else {
      throw new Error('Not an audio or video file');
    }

    // For this example, we'll use a simple transcription approach
    // In a real application, you'd use a proper STT service like Whisper API
    // This is a placeholder for demonstration purposes
    return "This is a placeholder for transcription. In a real application, you would use a Speech-to-Text API like OpenAI's Whisper.";
  } catch (error) {
    console.error('Error extracting text from audio/video:', error);
    return '';
  }
}

/**
 * Process a file to extract its content
 * @param {string} filePath - The path to the file
 * @returns {Promise<{extractedContent: string, summary: string, keywords: string[]}>}
 */
export async function processFile(filePath: string): Promise<{
  extractedContent: string,
  summary: string,
  keywords: string[]
}> {
  const fileType = getFileType(filePath);
  let extractedContent = '';
  
  // Extract content based on file type
  switch (fileType) {
    case 'pdf':
      extractedContent = await extractTextFromPdf(filePath);
      break;
    case 'doc':
      extractedContent = await extractTextFromDoc(filePath);
      break;
    case 'text':
      extractedContent = await extractTextFromTextFile(filePath);
      break;
    case 'image':
      extractedContent = await extractTextFromImage(filePath);
      break;
    case 'audio':
    case 'video':
      extractedContent = await extractTextFromAudioVideo(filePath);
      break;
    default:
      extractedContent = 'File type not supported for content extraction.';
  }
  
  // Generate summary and extract keywords
  const summary = await createSummary(extractedContent);
  const keywords = await extractKeywords(extractedContent);
  
  return {
    extractedContent,
    summary,
    keywords
  };
}
