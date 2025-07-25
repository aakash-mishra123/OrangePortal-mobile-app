import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { apiRequest, trackActivity } from '../services/api';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  serviceCount: number;
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiRequest('/api/categories'),
  });

  const handleCategoryPress = async (category: Category) => {
    await trackActivity('category_view', { categoryId: category.id });
    navigation.navigate('Services' as never, { categoryId: category.id } as never);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Welcome{user ? `, ${user.firstName}` : ''}!
          </Text>
          <Text style={styles.subtitle}>
            Discover our digital transformation services
          </Text>
        </View>
        <View style={styles.notificationBadge}>
          <Ionicons name="notifications-outline" size={24} color="#EA7C25" />
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>500+</Text>
          <Text style={styles.statLabel}>Projects</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>200+</Text>
          <Text style={styles.statLabel}>Clients</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>15+</Text>
          <Text style={styles.statLabel}>Years</Text>
        </View>
      </View>

      {/* Categories Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Services</Text>
        <View style={styles.categoriesGrid}>
          {categories?.map((category: Category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(category)}
            >
              <View style={styles.categoryIcon}>
                <Ionicons 
                  name={getCategoryIcon(category.icon)} 
                  size={32} 
                  color="#EA7C25" 
                />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryDescription} numberOfLines={2}>
                {category.description}
              </Text>
              <Text style={styles.serviceCount}>
                {category.serviceCount} services
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Search' as never)}
          >
            <Ionicons name="search" size={24} color="white" />
            <Text style={styles.actionButtonText}>Find Services</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Services' as never)}
          >
            <Ionicons name="grid" size={24} color="white" />
            <Text style={styles.actionButtonText}>Browse All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Testimonial */}
      <View style={styles.testimonialCard}>
        <Text style={styles.testimonialText}>
          "OrangeMantra transformed our business with their innovative digital solutions. 
          Highly recommended!"
        </Text>
        <Text style={styles.testimonialAuthor}>- Sarah Johnson, CEO</Text>
      </View>
    </ScrollView>
  );
}

function getCategoryIcon(iconName: string): keyof typeof Ionicons.glyphMap {
  const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
    'design': 'color-palette',
    'development': 'code-slash',
    'mobile': 'phone-portrait',
    'cloud': 'cloud',
    'ai': 'hardware-chip',
    'consulting': 'people',
    'default': 'business'
  };
  
  return iconMap[iconName] || iconMap['default'];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  notificationBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    marginTop: 1,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EA7C25',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 60) / 2,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 16,
  },
  serviceCount: {
    fontSize: 12,
    color: '#EA7C25',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 0.48,
    backgroundColor: '#EA7C25',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  testimonialCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EA7C25',
  },
  testimonialText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#333',
    lineHeight: 24,
    marginBottom: 12,
  },
  testimonialAuthor: {
    fontSize: 14,
    color: '#EA7C25',
    fontWeight: '500',
  },
});