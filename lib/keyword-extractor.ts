/**
 * Keyword extraction utility
 * This is a simplified implementation of keyword extraction using TF-IDF-like approach.
 * In a production environment, you might want to use a more robust ML-based solution.
 */

import keywordExtractor from 'keyword-extractor';

/**
 * Extract keywords from text
 * @param {string} text - The input text
 * @param {number} maxKeywords - Maximum number of keywords to extract
 * @returns {Promise<string[]>} - Array of extracted keywords
 */
export async function extractKeywords(
  text: string,
  maxKeywords: number = 10
): Promise<string[]> {
  try {
    // Handle empty or very short text
    if (!text || text.length < 100) {
      return [];
    }

    // Use the keyword-extractor library to extract keywords
    const extraction = keywordExtractor.extract(text, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true
    });
    
    // Simple word frequency analysis on the extracted keywords
    const wordFrequency: Record<string, number> = {};
    for (const word of extraction) {
      // Skip very short words
      if (word.length <= 2) {
        continue;
      }
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
    
    // Sort words by frequency
    const sortedWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
    
    // Return the top keywords
    return sortedWords.slice(0, maxKeywords);
  } catch (error) {
    console.error('Error extracting keywords:', error);
    return [];
  }
}
