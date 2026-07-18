/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

/*import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App; */
/*import React from 'react';
import {SafeAreaView} from 'react-native';
import {takePhoto} from './services/uploadService';
import CaptureButton from './src/components/CaptureButton';

import MainScreen from './MainScreen';
export default function App() {
  return <MainScreen />;

  // 👇 ADD HERE
  const handleScan = async () => {
    try {
      const image = await takePhoto();

      console.log(image);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView>
      <CaptureButton title="📷 Take Photo" onPress={handleScan} />
    </SafeAreaView>
  );
}
*/
// src/screens/MainScreen.tsx
/*
import React from 'react';

import {SafeAreaView, StyleSheet} from 'react-native';

import CaptureButton from './src/components/CaptureButton';
import MainScreen from './src/accessibility/mainScreen';
import {takePhoto} from './services/uploadService';

export default function MainScreen() {
  // 📷 CAMERA BUTTON FUNCTION
  const handleScan = async () => {
    try {
      // Open Camera
      const image = await takePhoto();

      // Check image exists
      if (!image) {
        console.log('No image captured');
        return;
      }

      // Debug image object
      console.log('Captured Image:', image);
    } catch (error) {
      console.log('Camera Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CaptureButton title="📷 Take Photo" onPress={handleScan} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
}); */
// App.tsx

/*import React from 'react';

import MainScreen from './src/accessibility/Mainscreen.tsx';

export default function App() {
  return <MainScreen />;
}*/
/*import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';

import Mainscreen from './src/accessibility/Mainscreen';
import TextToSpeech from './src/accessibility/textToSpeech';
import VibrationFeedback from './src/accessibility/vibrationFeedback';

import CaptureButton from './src/components/CaptureButton';
import ResultCard from './src/components/ResultCard';

function App() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <Mainscreen />

        <TextToSpeech />

        <VibrationFeedback />

        <CaptureButton />

        <ResultCard />
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;*/
/*import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';

import MainScreen from './src/accessibility/MainScreen';
//import {textToSpeech} from './src/accessibility/textToSpeech';
import textToSpeech from './src/accessibility/textToSpeech';
import vibrationFeedback from './src/accessibility/vibrationFeedback';

import CaptureButton from './src/components/CaptureButton';
import ResultCard from './src/components/ResultCard';

function App() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <MainScreen />
        <textToSpeech />
        <CaptureButton />
        <vibrationFeedback />
        <ResultCard />
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;*/
import React from 'react';

import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';

import Mainscreen from './src/accessibility/Mainscreen';

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Mainscreen />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
