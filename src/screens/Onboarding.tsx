
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigation = useNavigation();
  
  const slides = [
    {
      icon: 'book-open',
      title: "진짜 시험처럼 연습해요",
      description: "실제 OPIc 시험과 동일한 환경에서 부담 없이 연습할 수 있어요."
    },
    {
      icon: 'message-circle',
      title: "AI가 도와드려요",
      description: "내 말하기를 분석해서 어떻게 하면 더 자연스러운지 알려줘요."
    },
    {
      icon: 'award',
      title: "실력이 쑥쑥 늘어요",
      description: "꾸준히 연습하면 자신감이 생기고 OPIc 점수도 올라가요!"
    }
  ];
  
  const handleNext = async () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Complete onboarding
      try {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        navigation.navigate('SignIn' as never);
      } catch (error) {
        console.error('Error saving onboarding status:', error);
      }
    }
  };
  
  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      navigation.navigate('SignIn' as never);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };
  
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'book-open':
        return <Image source={require('../../assets/book-icon.png')} style={styles.slideIcon} />;
      case 'message-circle':
        return <Image source={require('../../assets/message-icon.png')} style={styles.slideIcon} />;
      case 'award':
        return <Image source={require('../../assets/award-icon.png')} style={styles.slideIcon} />;
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.slideContent}>
          {renderIcon(slides[currentSlide].icon)}
          <Text style={styles.title}>{slides[currentSlide].title}</Text>
          <Text style={styles.description}>{slides[currentSlide].description}</Text>
          
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.paginationDot,
                  index === currentSlide && styles.activeDot
                ]} 
              />
            ))}
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleNext}
        >
          <Text style={styles.primaryButtonText}>
            {currentSlide === slides.length - 1 ? '시작하기' : '다음'}
          </Text>
        </TouchableOpacity>
        
        {currentSlide < slides.length - 1 && (
          <TouchableOpacity 
            onPress={handleSkip}
          >
            <Text style={styles.skipText}>건너뛰기</Text>
          </TouchableOpacity>
        )}
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
    paddingHorizontal: 24,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  slideIcon: {
    width: 96,
    height: 96,
    marginBottom: 24,
    tintColor: '#8B5CF6', // Purple color from web app
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1F2937',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 32,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#8B5CF6', // Purple color from web app
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#8B5CF6', // Purple color from web app
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Onboarding;
