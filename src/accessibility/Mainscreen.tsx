/*import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import CaptureButton from './src/components/CaptureButton';
import ResultCard from './src/components/ResultCard';
import {pickImage, takePhoto, uploadImage} from './services/uploadService';
import {textToSpeech, stopSpeech} from './src/accessibility/textToSpeech';
//import { vibrate } from "./src/accessibility/vibrationFeedback";
import {vibrate} from './src/accessibility/vibrationFeedback';

export default function MainScreen() {
  // State management
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTTSReady, setIsTTSReady] = useState(false);

  // Initialize Text-to-Speech on component mount
  useEffect(() => {
    const setupTTS = () => {
      setIsTTSReady(true);
    };

    setupTTS();

    // Cleanup on unmount
    return () => {
      stopSpeech();
    };
  }, []);

  // Handle scan with proper error handling
  const handleScan = async (useCamera: boolean = false) => {
    // Reset states
    setError('');
    setResult('');
    setLoading(true);

    try {
      // Step 1: Get image from camera or gallery
      const image = useCamera ? await takePhoto() : await pickImage();

      if (!image) {
        setLoading(false);
        return; // User cancelled
      }

      // Validate image
      if (!image.uri) {
        throw new Error('Failed to get image data');
      }

      // Step 2: Upload to server
      const YOUR_API_URL = 'https://your-api.com/upload'; // Replace with your actual API
      const response = await uploadImage(image, YOUR_API_URL);

      // Step 3: Validate response
      if (!response || !response.product || !response.color) {
        throw new Error('Invalid response from server');
      }

      // Step 4: Format result
      const output = `Product: ${response.product}. Color: ${response.color}.`;
      setResult(output);

      // Step 5: Accessibility feedback (only if TTS is ready)
      if (isTTSReady) {
        await textToSpeech(output);
        vibrate();
      } else {
        // Fallback: just vibrate if TTS isn't ready
        vibrate();
      }
    } catch (err: any) {
      console.error('Scan error:', err);
      const errorMessage =
        err.message || 'Failed to process image. Please try again.';
      setError(errorMessage);

      // Speak error for accessibility
      if (isTTSReady) {
        textToSpeech('Scan failed. Please try again.');
      }

      Alert.alert(
        'Scan Failed',
        errorMessage,
        [{text: 'OK', onPress: () => {}}],
        {cancelable: true},
      );
    } finally {
      setLoading(false);
    }
  };

  // Clear current result
  const clearResult = () => {
    setResult('');
    setError('');
    if (isTTSReady) {
      stopSpeech();
    }
  };

  // Retry last scan
  const retryScan = () => {
    clearResult();
    handleScan(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>🔍 Accessible Vision Scanner</Text>
            <Text style={styles.subtitle}>
              Point your camera at any product to identify it
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.buttonRow}>
              <CaptureButton
                title="📷 Take Photo"
                onPress={() => handleScan(true)}
                disabled={loading}
                variant="primary"
              />
              <CaptureButton
                title="🖼️ Choose from Gallery"
                onPress={() => handleScan(false)}
                disabled={loading}
                variant="secondary"
              />
            </View>
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Processing image...</Text>
              <Text style={styles.loadingSubtext}>
                This may take a few seconds
              </Text>
            </View>
          )}

          {error !== '' && !loading && (
            <ResultCard
              title="❌ Error"
              description={error}
              variant="error"
              onClose={clearResult}
              showRetry={true}
              onRetry={retryScan}
            />
          )}

          {result !== '' && !loading && (
            <ResultCard
              title="✅ Scan Result"
              description={result}
              variant="success"
              onClose={clearResult}
              showRetry={true}
              onRetry={retryScan}
              timestamp={new Date().toLocaleTimeString()}
            />
          )}

          {!result && !error && !loading && (
            <View style={styles.helpContainer}>
              <Text style={styles.helpTitle}>How to use:</Text>
              <Text style={styles.helpText}>
                1. Tap "Take Photo" to capture a product
              </Text>
              <Text style={styles.helpText}>
                2. Or select an existing photo from gallery
              </Text>
              <Text style={styles.helpText}>
                3. Wait for AI to identify the product
              </Text>
              <Text style={styles.helpText}>
                4. Results will be spoken aloud automatically
              </Text>
            </View>
          )}

          {isTTSReady && (
            <View style={styles.accessibilityBadge}>
              <Text style={styles.accessibilityText}>
                🔊 Voice guidance active
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    // paddingTop: Platform.OS === 'ios' ? 20 : 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    flexWrap: 'wrap',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  loadingSubtext: {
    marginTop: 4,
    fontSize: 12,
    color: '#999',
  },
  helpContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#e8f0fe',
    borderRadius: 12,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
  },
  accessibilityBadge: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  accessibilityText: {
    color: '#fff',
    fontSize: 12,
  },
});*/
/*import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import CaptureButton from './src/components/CaptureButton';
import ResultCard from './src/components/ResultCard';
import {pickImage, takePhoto, uploadImage} from './services/uploadService';
import {textToSpeech, stopSpeech} from './src/accessibility/textToSpeech';
import {vibrate} from './src/accessibility/vibrationFeedback';

export default function MainScreen() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTTSReady, setIsTTSReady] = useState(false);

  useEffect(() => {
    const setupTTS = () => {
      setIsTTSReady(true);
    };
    setupTTS();
    return () => {
      stopSpeech();
    };
  }, []);

  const handleScan = async (useCamera: boolean = false) => {
    setError('');
    setResult('');
    setLoading(true);

    try {
      const image = useCamera ? await takePhoto() : await pickImage();

      if (!image) {
        setLoading(false);
        return;
      }

      if (!image.uri) {
        throw new Error('Failed to get image data');
      }

      const YOUR_API_URL = 'https://your-api.com/upload';
      const response = await uploadImage(image, YOUR_API_URL);

      if (!response || !response.product || !response.color) {
        throw new Error('Invalid response from server');
      }

      const output = `Product: ${response.product}. Color: ${response.color}.`;
      setResult(output);

      if (isTTSReady) {
        await textToSpeech(output);
        vibrate();
      } else {
        vibrate();
      }
    } catch (err: any) {
      console.error('Scan error:', err);
      const errorMessage =
        err.message || 'Failed to process image. Please try again.';
      setError(errorMessage);

      if (isTTSReady) {
        textToSpeech('Scan failed. Please try again.');
      }

      Alert.alert(
        'Scan Failed',
        errorMessage,
        [{text: 'OK', onPress: () => {}}],
        {cancelable: true},
      );
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setResult('');
    setError('');
    if (isTTSReady) {
      stopSpeech();
    }
  };

  const retryScan = () => {
    clearResult();
    handleScan(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>

          <View style={styles.header}>
            <Text style={styles.title}>🔍 Accessible Vision Scanner</Text>
            <Text style={styles.subtitle}>
              Point your camera at any product to identify it
            </Text>
          </View>


          <View style={styles.buttonContainer}>

            <View style={styles.bigButtonWrapper}>
              <CaptureButton
                title="📷 Take Photo"
                onPress={() => handleScan(true)}
                disabled={loading}
                variant="primary"
              />
            </View>


            <View style={styles.smallButtonWrapper}>
              <CaptureButton
                title="🖼️ Choose from Gallery"
                onPress={() => handleScan(false)}
                disabled={loading}
                variant="secondary"
              />
            </View>
          </View>


          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Processing image...</Text>
              <Text style={styles.loadingSubtext}>
                This may take a few seconds
              </Text>
            </View>
          )}


          {error !== '' && !loading && (
            <ResultCard
              title="❌ Error"
              description={error}
              variant="error"
              onClose={clearResult}
              showRetry={true}
              onRetry={retryScan}
            />
          )}


          {result !== '' && !loading && (
            <ResultCard
              title="✅ Scan Result"
              description={result}
              variant="success"
              onClose={clearResult}
              showRetry={true}
              onRetry={retryScan}
              timestamp={new Date().toLocaleTimeString()}
            />
          )}


          {isTTSReady && (
            <View style={styles.accessibilityBadge}>
              <Text style={styles.accessibilityText}>
                🔊 Voice guidance active
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    alignItems: 'center', // centers everything horizontally
    justifyContent: 'flex-end',
    marginBottom: 100,
    gap: 16,
    lineheight: 20,
  },
  bigButtonWrapper: {
    width: '90%', // big take photo button
    transform: [{scaleY: 1.4}], // makes it taller
  },
  smallButtonWrapper: {
    width: '80%', // smaller gallery button
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 30,
    padding: 20,
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  loadingSubtext: {
    marginTop: 4,
    fontSize: 12,
    color: '#999',
  },
  accessibilityBadge: {
    marginTop: 30,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  accessibilityText: {
    color: '#fff',
    fontSize: 12,
  },
});*/
/*import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import CaptureButton from './src/components/CaptureButton';
import ResultCard from './src/components/ResultCard';

import {pickImage, takePhoto, uploadImage} from './services/uploadService';

import {textToSpeech, stopSpeech} from './src/accessibility/textToSpeech';

import {vibrate} from './src/accessibility/vibrationFeedback';

export default function MainScreen() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTTSReady, setIsTTSReady] = useState(false);

  useEffect(() => {
    const setupTTS = () => {
      setIsTTSReady(true);
    };

    setupTTS();

    return () => {
      stopSpeech();
    };
  }, []);

  const handleScan = async (useCamera: boolean = false) => {
    setError('');
    setResult('');
    setLoading(true);

    try {
      const image = useCamera ? await takePhoto() : await pickImage();

      if (!image) {
        setLoading(false);
        return;
      }

      if (!image.uri) {
        throw new Error('Failed to get image data');
      }

      const YOUR_API_URL = 'https://your-api.com/upload';

      const response = await uploadImage(image, YOUR_API_URL);

      if (!response || !response.product || !response.color) {
        throw new Error('Invalid response from server');
      }

      const output = `Product: ${response.product}. Color: ${response.color}.`;

      setResult(output);

      if (isTTSReady) {
        await textToSpeech(output);
        vibrate();
      } else {
        vibrate();
      }
    } catch (err: any) {
      console.error('Scan error:', err);

      const errorMessage =
        err.message || 'Failed to process image. Please try again.';

      setError(errorMessage);

      if (isTTSReady) {
        textToSpeech('Scan failed. Please try again.');
      }

      Alert.alert('Scan Failed', errorMessage, [{text: 'OK'}], {
        cancelable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setResult('');
    setError('');

    if (isTTSReady) {
      stopSpeech();
    }
  };

  const retryScan = () => {
    clearResult();
    handleScan(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>

          <View style={styles.header}>
            <Text style={styles.title}>🔍 Accessible Vision Scanner</Text>

            <Text style={styles.subtitle}>
              Point your camera at any product to identify it instantly
            </Text>
          </View>


          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />

              <Text style={styles.loadingText}>Processing image...</Text>

              <Text style={styles.loadingSubtext}>
                Please wait a few seconds
              </Text>
            </View>
          )}


          {error !== '' && !loading && (
            <ResultCard
              title="❌ Error"
              description={error}
              variant="error"
              onClose={clearResult}
              showRetry={true}
              onRetry={retryScan}
            />
          )}


          {result !== '' && !loading && (
            <ResultCard
              title="✅ Scan Result"
              description={result}
              variant="success"
              onClose={clearResult}
              showRetry={true}
              onRetry={retryScan}
              timestamp={new Date().toLocaleTimeString()}
            />
          )}


          {isTTSReady && (
            <View style={styles.accessibilityBadge}>
              <Text style={styles.accessibilityText}>
                🔊 Voice guidance active
              </Text>
            </View>
          )}


          <View style={styles.bottomSection}>

            <View style={styles.bigButtonWrapper}>
              <CaptureButton
                title="📷 Take Photo"
                onPress={() => handleScan(true)}
                disabled={loading}
                variant="primary"
              />
            </View>


            <View style={styles.smallButtonWrapper}>
              <CaptureButton
                title="🖼️ Choose from Gallery"
                onPress={() => handleScan(false)}
                disabled={loading}
                variant="secondary"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#071026',
  },

  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    justifyContent: 'space-between',
  },

  header: {
    alignItems: 'center',
    marginTop: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 16,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },

  bottomSection: {
    width: '100%',
    marginBottom: 40,
    alignItems: 'center',
    gap: 18,
  },

  bigButtonWrapper: {
    width: '100%',
    transform: [{scaleY: 3.5}],
    marginTop: 40,
    marginBottom : 70,
  },

  smallButtonWrapper: {
    width: '90%',
  },

  loadingContainer: {
    alignItems: 'center',
    marginTop: 30,
    padding: 24,
    backgroundColor: '#1E293B',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },

  loadingText: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  loadingSubtext: {
    marginTop: 6,
    fontSize: 13,
    color: '#94A3B8',
  },

  accessibilityBadge: {
    alignSelf: 'center',
    backgroundColor: '#133e9b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    marginBottom: 20,
    marginTop: 20,
  },

  accessibilityText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
*/
/*import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
  ImageBackground, // Import for pattern background
} from 'react-native';

import CaptureButton from './src/components/CaptureButton';
import ResultCard from './src/components/ResultCard';

import {pickImage, takePhoto, uploadImage} from './services/uploadService';

import {textToSpeech, stopSpeech} from './src/accessibility/textToSpeech';

import {vibrate} from './src/accessibility/vibrationFeedback';

export default function MainScreen() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTTSReady, setIsTTSReady] = useState(false);

  useEffect(() => {
    const setupTTS = () => {
      setIsTTSReady(true);
    };

    setupTTS();

    return () => {
      stopSpeech();
    };
  }, []);

  const handleScan = async (useCamera: boolean = false) => {
    setError('');
    setResult('');
    setLoading(true);

    try {
      const image = useCamera ? await takePhoto() : await pickImage();

      if (!image) {
        setLoading(false);
        return;
      }

      if (!image.uri) {
        throw new Error('Failed to get image data');
      }

      const YOUR_API_URL = 'https://your-api.com/upload';

      const response = await uploadImage(image, YOUR_API_URL);

      if (!response || !response.product || !response.color) {
        throw new Error('Invalid response from server');
      }

      const output = `Product: ${response.product}. Color: ${response.color}.`;

      setResult(output);

      if (isTTSReady) {
        await textToSpeech(output);
        vibrate();
      } else {
        vibrate();
      }
    } catch (err: any) {
      console.error('Scan error:', err);

      const errorMessage =
        err.message || 'Failed to process image. Please try again.';

      setError(errorMessage);

      if (isTTSReady) {
        textToSpeech('Scan failed. Please try again.');
      }

      Alert.alert('Scan Failed', errorMessage, [{text: 'OK'}], {
        cancelable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setResult('');
    setError('');

    if (isTTSReady) {
      stopSpeech();
    }
  };

  const retryScan = () => {
    clearResult();
    handleScan(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>

          <View style={styles.header}>
            <Text style={styles.title}>🔍 Accessible Vision Scanner</Text>

            <Text style={styles.subtitle}>
              Point your camera at any product to identify it instantly
            </Text>
          </View>


          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />

              <Text style={styles.loadingText}>Processing image...</Text>

              <Text style={styles.loadingSubtext}>
                Please wait a few seconds
              </Text>
            </View>
          )}


          {error !== '' && !loading && (
            <ResultCard
              title="❌ Error"
              description={error}
              variant="error"
              onClose={clearResult}
              showRetry={true}
              onRetry={retryScan}
            />
          )}


          {result !== '' && !loading && (
            <ResultCard
              title="✅ Scan Result"
              description={result}
              variant="success"
              onClose={clearResult}
              showRetry={true}
              onRetry={retryScan}
              timestamp={new Date().toLocaleTimeString()}
            />
          )}


          {isTTSReady && (
            <View style={styles.accessibilityBadge}>
              <Text style={styles.accessibilityText}>
                🔊 Voice guidance active
              </Text>
            </View>
          )}


          <View style={styles.bottomSection}>

            <View style={styles.bigButtonWrapper}>
              <CaptureButton
                title="📷 Take Photo"
                onPress={() => handleScan(true)}
                disabled={loading}
                variant="primary"
                // Pass conceptual styling prop to CaptureButton for custom font
                // Assumption: CaptureButton accepts textStyle prop
                textStyle={{
                  fontFamily: 'Poppins-Bold',
                  fontSize: 18,
                }}
              />
            </View>


<View style={styles.galleryButtonOuter}>
  <ImageBackground
    source={require('./assets/star_pattern.png')}
    style={[styles.galleryButtonInner, styles.backgroundImage]} // Combined styles here
  >
    <CaptureButton
      title="🖼️ Choose from Gallery"
      onPress={() => handleScan(false)}
      disabled={loading}
      variant="secondary"
      style={styles.galleryButton} // Use StyleSheet reference
      textStyle={styles.galleryButtonText} // Use StyleSheet reference
    />
  </ImageBackground>
</View>

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#071026',
  },

  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    justifyContent: 'space-between',
  },

  header: {
    alignItems: 'center',
    marginTop: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    // Applied a more curated font conceptually
    // fontFamily: 'Poppins-Bold',
  },

  subtitle: {
    fontSize: 16,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },

  bottomSection: {
    width: '100%',
    marginBottom: 40,
    alignItems: 'center',
    gap: 18,
  },

  bigButtonWrapper: {
    width: '100%',
    transform: [{scaleY: 3.5}],
    marginTop: 40,
    marginBottom: 70,
  },

  // New styles for the white, star-patterned Gallery Button
  galleryButtonOuter: {
    width: '90%',
    borderRadius: 18,
    overflow: 'hidden', // to contain the pattern
  },

  galleryButtonInner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF', // solid white
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingContainer: {
    alignItems: 'center',
    marginTop: 30,
    padding: 24,
    backgroundColor: '#1E293B',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },

  loadingText: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  loadingSubtext: {
    marginTop: 6,
    fontSize: 13,
    color: '#94A3B8',
  },

  accessibilityBadge: {
    alignSelf: 'center',
    backgroundColor: '#133e9b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    marginBottom: 20,
    marginTop: 20,
  },

  accessibilityText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
*/
/*import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
  ImageBackground,
} from 'react-native';

import CaptureButton from './src/components/CaptureButton';
import ResultCard from './src/components/ResultCard';

import {pickImage, takePhoto, uploadImage} from './services/uploadService';

import {textToSpeech, stopSpeech} from './src/accessibility/textToSpeech';

import {vibrate} from './src/accessibility/vibrationFeedback';

export default function MainScreen() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTTSReady, setIsTTSReady] = useState(false);

  useEffect(() => {
    const setupTTS = () => {
      setIsTTSReady(true);
    };

    setupTTS();

    return () => {
      stopSpeech();
    };
  }, []);

  const handleScan = async (useCamera: boolean = false) => {
    setError('');
    setResult('');
    setLoading(true);

    try {
      const image = useCamera ? await takePhoto() : await pickImage();

      if (!image) {
        setLoading(false);
        return;
      }

      if (!image.uri) {
        throw new Error('Failed to get image data');
      }

      const YOUR_API_URL = 'https://your-api.com/upload';

      const response = await uploadImage(image, YOUR_API_URL);

      if (!response || !response.product || !response.color) {
        throw new Error('Invalid response from server');
      }

      const output = `Product: ${response.product}. Color: ${response.color}.`;

      setResult(output);

      if (isTTSReady) {
        await textToSpeech(output);
        vibrate();
      } else {
        vibrate();
      }
    } catch (err: any) {
      console.error('Scan error:', err);

      const errorMessage =
        err.message || 'Failed to process image. Please try again.';

      setError(errorMessage);

      if (isTTSReady) {
        textToSpeech('Scan failed. Please try again.');
      }

      Alert.alert('Scan Failed', errorMessage, [{text: 'OK'}], {
        cancelable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setResult('');
    setError('');

    if (isTTSReady) {
      stopSpeech();
    }
  };

  const retryScan = () => {
    clearResult();
    handleScan(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>

          <View style={styles.header}>
            <Text style={styles.title}>🔍 Accessible Vision Scanner</Text>
            <Text style={styles.subtitle}>
              Point your camera at any product to identify it instantly
            </Text>
          </View>


          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Processing image...</Text>
              <Text style={styles.loadingSubtext}>
                Please wait a few seconds
              </Text>
            </View>
          )}


          {error !== '' && !loading && (
            <ResultCard
              title="❌ Error"
              description={error}
              variant="error"
              onClose={clearResult}
              showRetry={true}
              onRetry={retryScan}
            />
          )}


          {result !== '' && !loading && (
            <ResultCard
              title="✅ Scan Result"
              description={result}
              variant="success"
              onClose={clearResult}
              showRetry={true}
              onRetry={retryScan}
              timestamp={new Date().toLocaleTimeString()}
            />
          )}


          {isTTSReady && (
            <View style={styles.accessibilityBadge}>
              <Text style={styles.accessibilityText}>
                🔊 Voice guidance active
              </Text>
            </View>
          )}


          <View style={styles.bottomSection}>

            <View style={styles.bigButtonWrapper}>
              <CaptureButton
                title="📷 Take Photo"
                onPress={() => handleScan(true)}
                disabled={loading}
                variant="primary"
                textStyle={styles.buttonText}
              />
            </View>

            <View style={styles.galleryButtonOuter}>
              <ImageBackground
                source={require('./assets/star_pattern.png')}
                style={styles.galleryButtonInner}>
                <CaptureButton
                  title="🖼️ Choose from Gallery"
                  onPress={() => handleScan(false)}
                  disabled={loading}
                  variant="secondary"
                  style={styles.galleryButton}
                  textStyle={styles.galleryButtonText}
                />
              </ImageBackground>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#071026',
  },

  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    justifyContent: 'space-between',
  },

  header: {
    alignItems: 'center',
    marginTop: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 16,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },

  bottomSection: {
    width: '100%',
    marginBottom: 40,
    alignItems: 'center',
    gap: 18,
  },

  bigButtonWrapper: {
    width: '100%',
    transform: [{scaleY: 2.5}],
    marginTop: 40,
    marginBottom: 70,
  },

  galleryButtonOuter: {
    width: '90%',
    borderRadius: 30,
    overflow: 'hidden',
  },

  galleryButtonInner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  galleryButton: {
    width: '100%',
  },
  cameraButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 50,
  },

  cameraBackground: {
    width: 320,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cameraImageStyle: {
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#FFD700',
  },

  captureButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },

  galleryButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#071026',
  },

  backgroundImage: {
    resizeMode: 'cover',
  },

  loadingContainer: {
    alignItems: 'center',
    marginTop: 30,
    padding: 24,
    backgroundColor: '#1E293B',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },

  loadingText: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  loadingSubtext: {
    marginTop: 6,
    fontSize: 13,
    color: '#94A3B8',
  },

  accessibilityBadge: {
    alignSelf: 'center',
    backgroundColor: '#133e9b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    marginBottom: 20,
    marginTop: 20,
  },

  accessibilityText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  buttonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
  },
});*/
import React, {useState, useEffect, useRef} from 'react';
import {takePhoto, pickImage, uploadImage} from '../../services/uploadService';

import {textToSpeech} from './textToSpeech';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

const STARS = Array.from({length: 40}, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: Math.random() * 3 + 1.5,
  opacity: Math.random() * 0.7 + 0.3,
}));

function StarField() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {STARS.map(s => (
        <View
          key={s.id}
          style={[
            styles.star,
            {
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              borderRadius: s.size / 2,
              opacity: s.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

function CameraIcon() {
  return (
    <View style={icon.wrapper}>
      <View style={icon.body}>
        <View style={icon.notch} />
        <View style={icon.lensOuter}>
          <View style={icon.lensInner} />
        </View>
        <View style={icon.flash} />
      </View>
    </View>
  );
}

const icon = StyleSheet.create({
  wrapper: {alignItems: 'center', justifyContent: 'center', marginBottom: 18},
  body: {
    width: 100,
    height: 74,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  notch: {
    position: 'absolute',
    top: -16,
    width: 28,
    height: 12,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 4,
    borderBottomWidth: 0,
    borderColor: '#FFD700',
  },
  flash: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  lensOuter: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 4,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lensInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
});
interface ResultCardProps {
  variant: 'success' | 'error';
  product?: string;
  color?: string;
  errorMsg?: string;
  timestamp?: string;
  onScanAgain: () => void;
}

function ResultCard({
  variant,
  product,
  color,
  errorMsg,
  timestamp,
  onScanAgain,
}: ResultCardProps) {
  const isSuccess = variant === 'success';
  return (
    <View style={card.container}>
      <View style={card.statusRow}>
        <View
          style={[card.statusDot, isSuccess ? card.successDot : card.errorDot]}>
          <Text style={card.statusIcon}>{isSuccess ? '✓' : '✕'}</Text>
        </View>
        <Text
          style={[
            card.statusLabel,
            isSuccess ? card.successText : card.errorTextColor,
          ]}>
          {isSuccess ? 'Scan Successful!' : 'Scan Failed'}
        </Text>
      </View>

      {isSuccess ? (
        <>
          <View style={card.row}>
            <View style={card.rowIcon}>
              <Text style={card.rowEmoji}>📦</Text>
            </View>
            <Text style={card.rowLabel}>Product:</Text>
            <Text style={card.rowValue}>{product}</Text>
          </View>
          <View style={card.row}>
            <View style={card.rowIcon}>
              <Text style={card.rowEmoji}>🎨</Text>
            </View>
            <Text style={card.rowLabel}>Color:</Text>
            <Text style={card.rowValue}>{color}</Text>
          </View>
          <View style={card.ttsBanner}>
            <Text style={card.ttsText}>🔊 Reading result...</Text>
            <View style={card.waveform}>
              {[6, 14, 10, 18, 8, 14, 6].map((h, i) => (
                <View key={i} style={[card.waveBar, {height: h}]} />
              ))}
            </View>
          </View>
          {timestamp && <Text style={card.timestamp}>{timestamp}</Text>}
        </>
      ) : (
        <Text style={card.errorText}>{errorMsg}</Text>
      )}

      <TouchableOpacity
        style={card.scanAgainBtn}
        onPress={onScanAgain}
        activeOpacity={0.8}>
        <Text style={card.scanAgainText}>⟳ Scan Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const card = StyleSheet.create({
  container: {
    backgroundColor: '#0F1E3D',
    borderRadius: 20,
    padding: 22,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#1E3A6E',
    gap: 14,
  },
  statusRow: {flexDirection: 'row', alignItems: 'center', gap: 10},
  statusDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: {color: '#FFFFFF', fontSize: 16, fontWeight: 'bold'},
  statusLabel: {fontSize: 18, fontWeight: '700'},
  row: {flexDirection: 'row', alignItems: 'center', gap: 10},
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1E3A6E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowEmoji: {fontSize: 18},
  rowLabel: {fontSize: 15, color: '#94A3B8', width: 64},
  rowValue: {fontSize: 15, fontWeight: '700', color: '#FFFFFF', flexShrink: 1},
  ttsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A3468',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  ttsText: {color: '#FFFFFF', fontSize: 14, fontWeight: '600'},
  waveform: {flexDirection: 'row', alignItems: 'center', gap: 3},
  waveBar: {width: 3, borderRadius: 2, backgroundColor: '#FFFFFF'},
  timestamp: {
    textAlign: 'center',
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  errorText: {color: '#FCA5A5', fontSize: 14, lineHeight: 22},
  scanAgainBtn: {
    backgroundColor: '#1A3468',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  scanAgainText: {color: '#FFFFFF', fontSize: 16, fontWeight: '700'},
  successDot: {
    backgroundColor: '#22C55E',
  },

  errorDot: {
    backgroundColor: '#EF4444',
  },
  successText: {
    color: '#22C55E',
  },

  errorTextColor: {
    color: '#EF4444',
  },
});

type ScanState = 'idle' | 'loading' | 'success' | 'error';
interface ScanResult {
  product: string;
  color: string;
}

export default function MainScreen() {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.04,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const handleScan = async (useCamera: boolean) => {
    console.log('Camera button pressed');
    setScanState('loading');

    setResult(null);

    setErrorMsg('');

    try {
      // 📷 Open camera or gallery
      const image = useCamera ? await takePhoto() : await pickImage();

      // If cancelled
      if (!image) {
        setScanState('idle');

        return;
      }

      // 📤 Upload image to backend
      const response = await uploadImage(image);

      // Save result
      setResult(response);

      setScanState('success');

      // 🔊 Speak result
      await textToSpeech(`Detected product is ${response.product}`);
    } catch (err: any) {
      const msg = err?.message || 'Failed to process image. Please try again.';

      setErrorMsg(msg);

      setScanState('error');

      Alert.alert('Scan Failed', msg, [{text: 'OK'}], {cancelable: true});
    }
  };

  const handleScanAgain = () => {
    setScanState('idle');
    setResult(null);
    setErrorMsg('');
  };

  const timestamp = result
    ? new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }) +
      ', ' +
      new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
    : undefined;

  const CARD_SIZE = width * 0.75;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <StarField />

        <View style={styles.header}>
          <Text style={styles.title}>🔍 Accessible Vision Scanner</Text>
          <Text style={styles.subtitle}>
            Point your camera at any product to identify it instantly
          </Text>
        </View>

        {scanState === 'idle' && (
          <View style={styles.voiceBadge}>
            <Text style={styles.voiceBadgeText}>🔊 Voice guidance active</Text>
          </View>
        )}

        {scanState === 'loading' && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingTitle}>Processing image...</Text>
            <Text style={styles.loadingHint}>Please wait a few seconds</Text>
          </View>
        )}

        {(scanState === 'success' || scanState === 'error') && (
          <ResultCard
            variant={scanState}
            product={result?.product}
            color={result?.color}
            errorMsg={errorMsg}
            timestamp={timestamp}
            onScanAgain={handleScanAgain}
          />
        )}

        {scanState === 'idle' && (
          <View style={styles.cameraSection}>
            <Animated.View style={{transform: [{scale: pulse}]}}>
              <TouchableOpacity
                style={[
                  styles.cameraCard,
                  {width: CARD_SIZE, height: CARD_SIZE},
                ]}
                onPress={() => handleScan(true)}
                activeOpacity={0.85}>
                <StarField />
                <CameraIcon />
                <Text style={styles.cameraLabel}>Take Photo</Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={[styles.galleryBtn, {width: width * 0.82}]}
              onPress={() => handleScan(false)}
              activeOpacity={0.8}>
              <Text style={styles.galleryBtnText}>🖼️ Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#071026'},
  scroll: {flexGrow: 1, paddingBottom: 48},
  header: {
    alignItems: 'center',
    marginTop: 36,
    marginBottom: 24,
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
  },
  voiceBadge: {
    alignSelf: 'center',
    backgroundColor: '#133e9b',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    marginBottom: 32,
  },
  voiceBadgeText: {color: '#FFFFFF', fontSize: 13, fontWeight: '700'},
  loadingBox: {
    alignItems: 'center',
    marginHorizontal: 24,
    padding: 28,
    backgroundColor: '#0F1E3D',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E3A6E',
    gap: 8,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  loadingHint: {fontSize: 13, color: '#64748B'},
  cameraSection: {alignItems: 'center', gap: 22, paddingTop: 8},
  cameraCard: {
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: '#FFD700',
    backgroundColor: '#000814',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraLabel: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 6,
  },
  galleryBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    elevation: 6,
  },
  galleryBtnText: {color: '#071026', fontSize: 16, fontWeight: '800'},
  star: {
    position: 'absolute',
    backgroundColor: '#FFD700',
  },
});
