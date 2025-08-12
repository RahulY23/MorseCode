// Morse code mapping
export const MORSE_CODE_MAP = {
  'A': '.-',
  'B': '-...',
  'C': '-.-.',
  'D': '-..',
  'E': '.', 
  'F': '..-.',
  'G': '--.',
  'H': '....',
  'I': '..',
  'J': '.---',
  'K': '-.-',
  'L': '.-..',
  'M': '--',
  'N': '-.',
  'O': '---',
  'P': '.--.',
  'Q': '--.-',
  'R': '.-.',
  'S': '...', 
  'T': '-',
  'U': '..-', 
  'V': '...-',
  'W': '.--',
  'X': '-..-',
  'Y': '-.--',
  'Z': '--..',
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...', 
  '8': '---..',
  '9': '----.',
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  '/': '-..-.',
  '-': '-....-',
  '(': '-.--.',
  ')': '-.--.-',
  '&': '.-...',
  ':': '---...', 
  ';': '-.-.-.',
  '=': '-...-',
  '+': '.-.-.',
  '@': '.--.-.',
  // Space is handled explicitly in textToMorse and morseToText
};

// Reverse mapping for Morse to text conversion
export const TEXT_MAP = Object.fromEntries(
  Object.entries(MORSE_CODE_MAP).map(([key, value]) => [value, key])
);

/**
 * Convert text to Morse code
 * @param {string} text - The text to convert
 * @returns {string} - The Morse code representation
 */
export function textToMorse(text) {
  if (!text) return '';
  
  return text
    .toUpperCase()
    .split('')
    .map(char => {
      if (char === ' ') return '/'; // Use '/' for word spaces
      return MORSE_CODE_MAP[char] || ''; // Return empty string for unsupported chars
    })
    .filter(code => code !== '') // Remove empty codes for unsupported characters
    .join(' ') // Join characters with a single space
    .replace(/\s*\/\s*/g, ' / ') // Ensure single space around word separators
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

/**
 * Convert Morse code to text
 * @param {string} morse - The Morse code to convert
 * @returns {string} - The text representation
 */
export function morseToText(morse) {
  if (!morse) return '';
  
  return morse
    .split(' ') // Split by space to get individual Morse codes
    .map(code => {
      if (code === '/') return ' '; // Convert '/' back to space
      return TEXT_MAP[code] || ''; // Return empty string for invalid codes
    })
    .join('') // Join characters without spaces
    .trim();
}

/**
 * Validate if a string contains only valid Morse code characters
 * @param {string} morse - The string to validate
 * @returns {boolean} - True if valid Morse code
 */
export function isValidMorse(morse) {
  if (!morse) return true;
  
  // Allow dots, dashes, spaces, and slashes
  const validChars = /^[.\-\s\/]+$/;
  const containsOnlyValidChars = validChars.test(morse);

  if (!containsOnlyValidChars) return false;

  // Check if all individual codes are valid or are word separators
  const codes = morse.split(' ');
  for (const code of codes) {
    if (code === '') continue; // Handle multiple spaces
    if (code === '/') continue; // Word separator is valid
    if (!TEXT_MAP[code]) {
      return false; // Invalid Morse code sequence
    }
  }
  return true;
}

/**
 * Parse Morse code into timing elements for audio/visual playback
 * @param {string} morse - The Morse code to parse
 * @returns {Array} - Array of timing objects {type, duration}
 */
export function parseMorseForPlayback(morse) {
  if (!morse) return [];
  
  const elements = [];
  const codes = morse.split(' ');
  
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    
    if (code === '.') {
      elements.push({ type: 'dot', duration: 1 });
    } else if (code === '-') {
      elements.push({ type: 'dash', duration: 3 });
    } else if (code === '/') {
      elements.push({ type: 'word-space', duration: 7 });
    } else if (code !== '') { // Handle invalid codes or empty strings from multiple spaces
      // If it's an invalid code, we can skip it or represent it as an error
      // For now, we'll just skip it for playback
    }
    
    // Add inter-element space after dots and dashes, and inter-character space after each code
    if (code === '.' || code === '-') {
      elements.push({ type: 'element-space', duration: 1 });
    }
    // Add inter-character space after each code, unless it's the last one or a word space
    if (i < codes.length - 1 && codes[i+1] !== '/') {
        elements.push({ type: 'letter-space', duration: 3 });
    }
  }
  
  return elements;
}



