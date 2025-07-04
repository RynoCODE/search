import fs from 'fs-extra';
import path from 'path';
import { nanoid } from 'nanoid';

// Define database file path
const DATABASE_PATH = path.join(process.cwd(), 'data', 'database.json');

// Ensure the data directory exists
fs.ensureDirSync(path.dirname(DATABASE_PATH));

/**
 * File entry type definition
 */
export interface FileEntry {
  id: string;
  filename: string;
  filepath: string;
  extractedContent: string;
  summary: string;
  keywords: string[];
  uploadDate: string;
}

/**
 * Get all entries from the database
 * @returns {Promise<FileEntry[]>} - Array of file entries
 */
export async function getAllEntries(): Promise<FileEntry[]> {
  try {
    // Check if database file exists
    if (!(await fs.pathExists(DATABASE_PATH))) {
      // Create an empty database file
      await fs.writeJson(DATABASE_PATH, { files: [] });
      return [];
    }
    
    // Read the database file
    const data = await fs.readJson(DATABASE_PATH);
    return data.files || [];
  } catch (error) {
    console.error('Error reading database:', error);
    return [];
  }
}

/**
 * Save a new entry to the database
 * @param {Omit<FileEntry, 'id' | 'uploadDate'>} entry - File entry without ID and upload date
 * @returns {Promise<FileEntry>} - The saved file entry with ID and upload date
 */
export async function saveToDatabase(
  entry: Omit<FileEntry, 'id' | 'uploadDate'>
): Promise<FileEntry> {
  try {
    // Generate a unique ID and current date
    const id = nanoid();
    const uploadDate = new Date().toISOString();
    
    // Create the full entry
    const fullEntry: FileEntry = {
      ...entry,
      id,
      uploadDate
    };
    
    // Get all existing entries
    const entries = await getAllEntries();
    
    // Add the new entry
    entries.push(fullEntry);
    
    // Write back to the database file
    await writeEntriesAtomically(entries);
    
    return fullEntry;
  } catch (error) {
    console.error('Error saving to database:', error);
    throw error;
  }
}

/**
 * Write entries to the database file atomically
 * @param {FileEntry[]} entries - Array of file entries
 * @returns {Promise<void>}
 */
async function writeEntriesAtomically(entries: FileEntry[]): Promise<void> {
  try {
    const tempPath = `${DATABASE_PATH}.tmp`;
    
    // Write to a temporary file first
    await fs.writeJson(tempPath, { files: entries }, { spaces: 2 });
    
    // Rename the temporary file to replace the original
    await fs.rename(tempPath, DATABASE_PATH);
  } catch (error) {
    console.error('Error writing database file:', error);
    throw error;
  }
}

/**
 * Get a file entry by ID
 * @param {string} id - File entry ID
 * @returns {Promise<FileEntry | null>} - The file entry or null if not found
 */
export async function getFileById(id: string): Promise<FileEntry | null> {
  try {
    const entries = await getAllEntries();
    return entries.find(entry => entry.id === id) || null;
  } catch (error) {
    console.error('Error getting file by ID:', error);
    return null;
  }
}

/**
 * Get file from database (alias for getFileById)
 * @param {string} id - File entry ID
 * @returns {Promise<FileEntry | null>} - The file entry or null if not found
 */
export const getFromDatabase = getFileById;

/**
 * Search the database for entries matching the query
 * @param {string} query - Search query
 * @returns {Promise<FileEntry[]>} - Array of matching file entries
 */
export async function searchDatabase(query: string): Promise<FileEntry[]> {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }
    
    const entries = await getAllEntries();
    const normalizedQuery = query.toLowerCase().trim();
    
    // Filter entries based on the query
    return entries.filter(entry => {
      // Check if the query matches keywords (highest priority)
      const keywordMatch = entry.keywords.some(keyword => 
        keyword.toLowerCase().includes(normalizedQuery)
      );
      
      if (keywordMatch) return true;
      
      // Check if the query matches summary (medium priority)
      if (entry.summary.toLowerCase().includes(normalizedQuery)) return true;
      
      // Check if the query matches extracted content (lowest priority)
      return entry.extractedContent.toLowerCase().includes(normalizedQuery);
    }).sort((a, b) => {
      // Sort by relevance (keyword match > summary match > content match)
      const aKeywordMatch = a.keywords.some(keyword => 
        keyword.toLowerCase().includes(normalizedQuery)
      );
      
      const bKeywordMatch = b.keywords.some(keyword => 
        keyword.toLowerCase().includes(normalizedQuery)
      );
      
      // If only one has a keyword match
      if (aKeywordMatch && !bKeywordMatch) return -1;
      if (!aKeywordMatch && bKeywordMatch) return 1;
      
      // If both or neither have keyword matches, check summary matches
      const aSummaryMatch = a.summary.toLowerCase().includes(normalizedQuery);
      const bSummaryMatch = b.summary.toLowerCase().includes(normalizedQuery);
      
      if (aSummaryMatch && !bSummaryMatch) return -1;
      if (!aSummaryMatch && bSummaryMatch) return 1;
      
      // If still tied, sort by upload date (newest first)
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    });
  } catch (error) {
    console.error('Error searching database:', error);
    return [];
  }
}
