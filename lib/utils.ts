/**
 * Format date string in a human-readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Generate a truncated filename with ellipsis if too long
 * @param {string} filename - Original filename
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated filename
 */
export function truncateFilename(filename: string, maxLength: number = 30): string {
  if (filename.length <= maxLength) {
    return filename;
  }
  
  const extension = filename.split('.').pop() || '';
  const nameWithoutExtension = filename.substring(0, filename.length - extension.length - 1);
  
  const truncatedName = nameWithoutExtension.substring(0, maxLength - extension.length - 3);
  return `${truncatedName}...${extension ? `.${extension}` : ''}`;
}

/**
 * Get file icon type based on file extension
 * @param {string} filename - Filename with extension
 * @returns {string} - File type icon name
 */
export function getFileIconType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  if (['pdf'].includes(extension)) {
    return 'pdf';
  } else if (['doc', 'docx'].includes(extension)) {
    return 'doc';
  } else if (['xls', 'xlsx'].includes(extension)) {
    return 'excel';
  } else if (['ppt', 'pptx'].includes(extension)) {
    return 'powerpoint';
  } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
    return 'image';
  } else if (['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(extension)) {
    return 'audio';
  } else if (['mp4', 'mov', 'webm', 'mkv', 'avi'].includes(extension)) {
    return 'video';
  } else if (['txt', 'md', 'rtf'].includes(extension)) {
    return 'text';
  } else {
    return 'file';
  }
}

/**
 * Calculate file size display in appropriate units
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size with units
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Highlight search query in text
 * @param {string} text - Original text
 * @param {string} query - Search query to highlight
 * @returns {string} - Text with highlighted query
 */
export function highlightSearchQuery(text: string, query: string): string {
  if (!query || !text) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
