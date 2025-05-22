
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/peach-logo.png')} 
          style={styles.headerLogo} 
        />
        <Text style={styles.headerTitle}>Peach</Text>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile' as never)}
        >
          {user?.user_metadata?.avatar_url ? (
            <Image 
              source={{ uri: user.user_metadata.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user?.email?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>안녕하세요!</Text>
          <Text style={styles.welcomeText}>
            오늘도 Peach와 함께 OPIc 실력을 향상시켜 보세요.
          </Text>
          
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => navigation.navigate('Practice' as never)}
          >
            <Text style={styles.startButtonText}>연습 시작하기</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>메뉴</Text>
        
        <View style={styles.menuGrid}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Practice' as never)}
          >
            <View style={[styles.menuIcon, styles.purpleIcon]}>
              <Text style={styles.iconEmoji}>🎯</Text>
            </View>
            <Text style={styles.menuName}>연습하기</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {}}
          >
            <View style={[styles.menuIcon, styles.blueIcon]}>
              <Text style={styles.iconEmoji}>📝</Text>
            </View>
            <Text style={styles.menuName}>테스트</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {}}
          >
            <View style={[styles.menuIcon, styles.greenIcon]}>
              <Text style={styles.iconEmoji}>📊</Text>
            </View>
            <Text style={styles.menuName}>통계</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {}}
          >
            <View style={[styles.menuIcon, styles.orangeIcon]}>
              <Text style={styles.iconEmoji}>🏆</Text>
            </View>
            <Text style={styles.menuName}>성과</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLogo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileButton: {
    marginLeft: 'auto',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: '#8B5CF6', // Purple color from web app
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#8B5CF6',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1F2937',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  menuItem: {
    width: '50%',
    padding: 8,
  },
  menuInner: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  purpleIcon: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  blueIcon: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  greenIcon: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  orangeIcon: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
  },
  iconEmoji: {
    fontSize: 24,
  },
  menuName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
});

export default Home;
