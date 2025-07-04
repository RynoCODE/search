/**
 * Text summarization utility
 * This is a simplified implementation of text summarization using extraction-based methods.
 * In a production environment, you might want to use a more robust ML-based solution.
 */

/**
 * Calculate sentence significance based on word frequency
 * @param {string} sentence - The sentence to analyze
 * @param {Record<string, number>} wordFrequencies - Word frequency dictionary
 * @returns {number} - The significance score
 */
function calculateSentenceSignificance(
  sentence: string, 
  wordFrequencies: Record<string, number>
): number {
  const words = sentence
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2);
  
  let score = 0;
  for (const word of words) {
    score += wordFrequencies[word] || 0;
  }
  
  return words.length > 0 ? score / words.length : 0;
}

/**
 * Generate word frequencies from text
 * @param {string} text - The input text
 * @returns {Record<string, number>} - Word frequency dictionary
 */
function getWordFrequencies(text: string): Record<string, number> {
  const frequencies: Record<string, number> = {};
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2);
  
  // Common English stop words to exclude
  const stopWords = new Set([
    'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but', 
    'his', 'from', 'they', 'say', 'she', 'will', 'one', 'all', 'would', 'there', 
    'their', 'what', 'out', 'about', 'who', 'get', 'which', 'when', 'make', 'can', 
    'like', 'time', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 
    'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look'
  ]);
  
  for (const word of words) {
    if (!stopWords.has(word)) {
      frequencies[word] = (frequencies[word] || 0) + 1;
    }
  }
  
  return frequencies;
}

/**
 * Split text into sentences
 * @param {string} text - The input text
 * @returns {string[]} - Array of sentences
 */
function splitIntoSentences(text: string): string[] {
  // Basic sentence splitting - can be improved
  return text
    .replace(/([.?!])\s*(?=[A-Z])/g, '$1|')
    .split('|')
    .map(s => s.trim())
    .filter(s => s.length > 10); // Filter out very short sentences
}

/**
 * Create a summary from text
 * @param {string} text - The input text to summarize
 * @param {number} maxSentences - Maximum number of sentences in the summary
 * @returns {Promise<string>} - The generated summary
 */
export async function createSummary(
  text: string, 
  maxSentences: number = 5
): Promise<string> {
  try {
    // Handle empty or very short text
    if (!text || text.length < 100) {
      return text;
    }
    
    // Split the text into sentences
    const sentences = splitIntoSentences(text);
    
    // If there are very few sentences, return the original text
    if (sentences.length <= maxSentences) {
      return text;
    }
    
    // Calculate word frequencies
    const wordFrequencies = getWordFrequencies(text);
    
    // Calculate significance scores for each sentence
    const sentenceScores = sentences.map(sentence => ({
      sentence,
      score: calculateSentenceSignificance(sentence, wordFrequencies),
    }));
    
    // Sort sentences by score in descending order
    sentenceScores.sort((a, b) => b.score - a.score);
    
    // Take the top N sentences
    const topSentences = sentenceScores
      .slice(0, maxSentences)
      .map(item => item.sentence);
    
    // Find the original positions of these sentences
    const sentencePositions = topSentences.map(sentence => 
      sentences.findIndex(s => s === sentence)
    );
    
    // Sort by original position to maintain flow
    sentencePositions.sort((a, b) => a - b);
    
    // Construct the summary
    const summary = sentencePositions
      .map(position => sentences[position])
      .join(' ');
    
    return summary;
  } catch (error) {
    console.error('Error creating summary:', error);
    return text.substring(0, 1000) + '...'; // Fallback to a simple truncation
  }
}
