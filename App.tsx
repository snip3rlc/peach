
import 'react-native-url-polyfill/auto';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Screens
import SignIn from './src/screens/SignIn';
import Home from './src/screens/Home';
import Profile from './src/screens/Profile';
import Onboarding from './src/screens/Onboarding';
import Practice from './src/screens/Practice';
import TopicSelect from './src/screens/TopicSelect';
import QuestionSelect from './src/screens/QuestionSelect';
import PracticeAnswer from './src/screens/PracticeAnswer';
import RecordAnswer from './src/screens/RecordAnswer';

// Auth context
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

const Stack = createNativeStackNavigator();

function AppContent() {
  const { session, isLoading } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(false);
  
  // Check if user has seen onboarding
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('hasSeenOnboarding');
        setHasSeenOnboarding(value === 'true');
      } catch (error) {
        console.error('Error reading onboarding status:', error);
      }
    };
    
    checkOnboarding();
  }, []);
  
  if (isLoading) {
    return null; // or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!session ? (
          <>
            {!hasSeenOnboarding && (
              <Stack.Screen name="Onboarding" component={Onboarding} />
            )}
            <Stack.Screen name="SignIn" component={SignIn} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Practice" component={Practice} />
            <Stack.Screen name="TopicSelect" component={TopicSelect} />
            <Stack.Screen name="QuestionSelect" component={QuestionSelect} />
            <Stack.Screen name="PracticeAnswer" component={PracticeAnswer} />
            <Stack.Screen name="RecordAnswer" component={RecordAnswer} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
