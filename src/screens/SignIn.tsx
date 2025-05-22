
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { supabase } from '../lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import * as Linking from 'expo-linking';

const SignIn = ({ navigation, route }: any) => {
  const [loading, setLoading] = useState(false);
  
  // Get redirect params if any
  const redirect = route.params?.redirect;
  const plan = route.params?.plan;
  
  const redirectUri = makeRedirectUri({
    scheme: 'peach'
  });
  
  const handleSocialSignIn = async (provider: 'google' | 'apple' | 'kakao') => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: redirectUri
        }
      });
      
      if (error) {
        Alert.alert(`${provider} 로그인 중 오류가 발생했습니다.`);
        console.error(`Error signing in with ${provider}:`, error);
        return;
      }
      
      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
        
        if (result.type === 'success') {
          // Handle successful authentication redirect
          const { url } = result;
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            Alert.alert('로그인 중 오류가 발생했습니다.');
            console.error('Error getting session after OAuth redirect:', error);
          }
        }
      }
    } catch (error) {
      Alert.alert('로그인 중 오류가 발생했습니다.');
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/peach-logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={styles.title}>Peach</Text>
          <Text style={styles.subtitle}>Peach와 함께 오픽, 매일매일 실력 업!</Text>
        </View>
        
        <View style={styles.authContainer}>
          <TouchableOpacity 
            style={styles.googleButton} 
            onPress={() => handleSocialSignIn('google')}
            disabled={loading}
          >
            <Image
              source={require('../../assets/google-icon.png')}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Google로 계속하기</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.kakaoButton} 
            onPress={() => handleSocialSignIn('kakao')}
            disabled={loading}
          >
            <Image
              source={require('../../assets/kakao-icon.png')}
              style={styles.buttonIcon}
            />
            <Text style={styles.kakaoButtonText}>카카오로 계속하기</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.appleButton} 
            onPress={() => handleSocialSignIn('apple')}
            disabled={loading}
          >
            <Image
              source={require('../../assets/apple-icon.png')}
              style={styles.buttonIcon}
            />
            <Text style={styles.appleButtonText}>Apple로 계속하기</Text>
          </TouchableOpacity>
        </View>
        
        {loading && (
          <ActivityIndicator size="large" color="#8B5CF6" style={styles.loader} />
        )}
        
        <Text style={styles.termsText}>
          로그인하면 <Text style={styles.termsLink}>서비스 약관</Text>과 <Text style={styles.termsLink}>개인정보 보호정책</Text>에 동의하게 됩니다.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },
  authContainer: {
    width: '100%',
    maxWidth: 320,
    marginVertical: 20,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 16,
    marginBottom: 12,
  },
  kakaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE500',
    borderRadius: 8,
    paddingVertical: 16,
    marginBottom: 12,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 16,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  kakaoButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  appleButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  loader: {
    marginTop: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 40,
  },
  termsLink: {
    color: '#8B5CF6',
  },
});

export default SignIn;
