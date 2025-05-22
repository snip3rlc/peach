import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the navigation parameter types
type RootStackParamList = {
  TopicSelect: { level: string };
  Home: undefined;
};

type PracticeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TopicSelect'>;

const Practice = () => {
  const navigation = useNavigation<PracticeScreenNavigationProp>();
  
  const handleLevelSelect = (level: string) => {
    navigation.navigate('TopicSelect', { level });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Practice</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>연습할 레벨을 선택하세요</Text>
          <Text style={styles.infoText}>
            현재 영어 실력에 맞는 레벨을 선택하면 적합한 연습 문제와 템플릿을 제공해 드립니다.
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.levelCard}
          onPress={() => handleLevelSelect('intermediate')}
        >
          <View style={[styles.levelIcon, styles.yellowIcon]}>
            <Text style={styles.iconEmoji}>⚡</Text>
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelTitle}>Intermediate</Text>
            <Text style={styles.levelDescription}>
              다양한 주제에 대해 자세한 의견을 표현할 수 있는 단계
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.levelCard}
          onPress={() => handleLevelSelect('advanced')}
        >
          <View style={[styles.levelIcon, styles.greenIcon]}>
            <Text style={styles.iconEmoji}>🏆</Text>
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelTitle}>Advanced</Text>
            <Text style={styles.levelDescription}>
              복잡한 주제에 대해 유창하고 논리적으로 의견을 표현할 수 있는 단계
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#F3E8FF', // Light purple from web app
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
  },
  levelCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  levelIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  yellowIcon: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },
  greenIcon: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  iconEmoji: {
    fontSize: 20,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default Practice;
