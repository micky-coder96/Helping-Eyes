// textToSpeech.tsx - Complete fixed version
/*import Tts from 'react-native-tts';

interface SpeechOptions {
  language?: string;
  rate?: number;
}

// Initialize TTS with default settings
const initializeTTSInternal = async () => {
  try {
    await Tts.getInitStatus();
    Tts.setDefaultLanguage('en-US');
    Tts.setDefaultRate(0.5);
    console.log('TTS initialized successfully');
    return true;
  } catch (error) {
    console.error('TTS initialization failed:', error);
    throw error;
  }
};

// Call initialization
initializeTTSInternal();

// Fixed: Added proper typing for 'text' parameter
export const textToSpeech = async (
  text: string,
  options: SpeechOptions = {},
) => {
  if (!text) {
    console.warn('No text provided for speech');
    return;
  }

  try {
    await Tts.getInitStatus();

    // Fixed: Properly check if options exist
    if (options.language) {
      Tts.setDefaultLanguage(options.language);
    }
    if (options.rate) {
      Tts.setDefaultRate(options.rate);
    }

    Tts.speak(text);
  } catch (error) {
    console.error('Text-to-speech error:', error);
  }
};

export const stopSpeech = () => {
  Tts.stop();
};

export const checkTTSAvailability = async (): Promise<boolean> => {
  try {
    await Tts.getInitStatus();
    return true;
  } catch (error) {
    console.error('TTS not available:', error);
    return false;
  }
};

// Fixed: Added proper typing for 'rate' parameter
export const setSpeechRate = (rate: number) => {
  if (typeof rate === 'number' && rate >= 0.1 && rate <= 2.0) {
    Tts.setDefaultRate(rate);
  }
};

// Fixed: Added proper typing for 'language' parameter
export const setSpeechLanguage = (language: string) => {
  if (typeof language === 'string') {
    Tts.setDefaultLanguage(language);
  }
};

// Fixed: Export initializeTTS properly
export const initializeTTS = async (): Promise<boolean> => {
  try {
    await Tts.getInitStatus();
    Tts.setDefaultLanguage('en-US');
    Tts.setDefaultRate(0.5);
    return true;
  } catch (error) {
    console.error('TTS initialization failed:', error);
    return false;
  }
};

// Remove the pitch function entirely (or comment it out since it's not used)
// export const setSpeechPitch = (pitch: number) => {
//   console.warn('Pitch not supported in react-native-tts');
*/
// src/accessibility/textToSpeech.ts

import Tts from 'react-native-tts';

interface SpeechOptions {
  language?: string;
  rate?: number;
}

// Initialize TTS
export const initializeTTS = async (): Promise<boolean> => {
  try {
    await Tts.getInitStatus();

    await Tts.setDefaultLanguage('en-US');

    await Tts.setDefaultRate(0.5);

    console.log('TTS initialized successfully');

    return true;
  } catch (error) {
    console.error('TTS initialization failed:', error);

    return false;
  }
};

// 🔊 SPEAK TEXT
export const textToSpeech = async (
  text: string,
  options: SpeechOptions = {},
) => {
  if (!text) {
    console.warn('No text provided');
    return;
  }

  try {
    // Ensure TTS is initialized
    await Tts.getInitStatus();

    // Stop previous speech
    await Tts.stop();

    // Optional settings
    if (options.language) {
      await Tts.setDefaultLanguage(options.language);
    }

    if (options.rate) {
      await Tts.setDefaultRate(options.rate);
    }

    // Speak
    Tts.speak(text);
  } catch (error) {
    console.error('TTS Error:', error);
  }
};

// 🛑 STOP SPEECH
export const stopSpeech = async () => {
  try {
    await Tts.stop();
  } catch (error) {
    console.error('Stop speech error:', error);
  }
};

// ✅ CHECK TTS
export const checkTTSAvailability = async (): Promise<boolean> => {
  try {
    await Tts.getInitStatus();

    return true;
  } catch (error) {
    console.error('TTS not available:', error);

    return false;
  }
};

// 🎚 CHANGE SPEECH RATE
export const setSpeechRate = async (rate: number) => {
  if (rate >= 0.1 && rate <= 2.0) {
    await Tts.setDefaultRate(rate);
  }
};

// 🌍 CHANGE LANGUAGE
export const setSpeechLanguage = async (language: string) => {
  try {
    await Tts.setDefaultLanguage(language);
  } catch (error) {
    console.error('Language error:', error);
  }
};
