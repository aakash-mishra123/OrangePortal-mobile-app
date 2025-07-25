import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { apiRequest, trackActivity } from '../services/api';

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  pricing: {
    basic: number;
    standard: number;
    premium: number;
  };
  features: string[];
  deliveryTime: string;
}

export default function SearchScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'price' | 'popularity'>('relevance');
  const [priceRange, setPriceRange] = useState<'all' | 'under-1000' | '1000-5000' | 'over-5000'>('all');

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => apiRequest('/api/services'),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiRequest('/api/categories'),
  });

  const filteredServices = services?.filter((service: Service) => {
    const matchesSearch = !searchQuery || 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.features.some(feature => 
        feature.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesPriceRange = (() => {
      if (priceRange === 'all') return true;
      const minPrice = Math.min(...Object.values(service.pricing));
      switch (priceRange) {
        case 'under-1000': return minPrice < 1000;
        case '1000-5000': return minPrice >= 1000 && minPrice <= 5000;
        case 'over-5000': return minPrice > 5000;
        default: return true;
      }
    })();

    return matchesSearch && matchesPriceRange;
  })?.sort((a: Service, b: Service) => {
    switch (sortBy) {
      case 'price':
        return Math.min(...Object.values(a.pricing)) - Math.min(...Object.values(b.pricing));
      case 'popularity':
        return a.title.localeCompare(b.title); // Simplified popularity sort
      default:
        return 0; // Keep original order for relevance
    }
  });

  const handleServicePress = async (service: Service) => {
    await trackActivity('service_view', { serviceId: service.id, source: 'search' });
    navigation.navigate('ServiceDetail' as never, { serviceId: service.id } as never);
  };

  const popularSearches = [
    'Web Development',
    'Mobile App',
    'UI/UX Design',
    'E-commerce',
    'Digital Marketing',
    'Cloud Migration',
  ];

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services, features, or technologies..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Popular Searches (when no search query) */}
      {!searchQuery && (
        <View style={styles.popularSection}>
          <Text style={styles.sectionTitle}>Popular Searches</Text>
          <View style={styles.popularTags}>
            {popularSearches.map((term, index) => (
              <TouchableOpacity
                key={index}
                style={styles.popularTag}
                onPress={() => setSearchQuery(term)}
              >
                <Text style={styles.popularTagText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Filters (when searching) */}
      {searchQuery.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {/* Sort Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Sort by:</Text>
            <TouchableOpacity
              style={[styles.filterChip, sortBy === 'relevance' && styles.filterChipActive]}
              onPress={() => setSortBy('relevance')}
            >
              <Text style={[styles.filterChipText, sortBy === 'relevance' && styles.filterChipTextActive]}>
                Relevance
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, sortBy === 'price' && styles.filterChipActive]}
              onPress={() => setSortBy('price')}
            >
              <Text style={[styles.filterChipText, sortBy === 'price' && styles.filterChipTextActive]}>
                Price
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, sortBy === 'popularity' && styles.filterChipActive]}
              onPress={() => setSortBy('popularity')}
            >
              <Text style={[styles.filterChipText, sortBy === 'popularity' && styles.filterChipTextActive]}>
                Popular
              </Text>
            </TouchableOpacity>
          </View>

          {/* Price Range Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Price:</Text>
            <TouchableOpacity
              style={[styles.filterChip, priceRange === 'all' && styles.filterChipActive]}
              onPress={() => setPriceRange('all')}
            >
              <Text style={[styles.filterChipText, priceRange === 'all' && styles.filterChipTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, priceRange === 'under-1000' && styles.filterChipActive]}
              onPress={() => setPriceRange('under-1000')}
            >
              <Text style={[styles.filterChipText, priceRange === 'under-1000' && styles.filterChipTextActive]}>
                Under $1K
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, priceRange === '1000-5000' && styles.filterChipActive]}
              onPress={() => setPriceRange('1000-5000')}
            >
              <Text style={[styles.filterChipText, priceRange === '1000-5000' && styles.filterChipTextActive]}>
                $1K-$5K
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Search Results */}
      <ScrollView style={styles.resultsContainer}>
        {isLoading ? (
          <View style={styles.centered}>
            <Text>Searching...</Text>
          </View>
        ) : searchQuery.length > 0 ? (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {filteredServices?.length || 0} services found
              </Text>
            </View>

            {filteredServices?.map((service: Service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => handleServicePress(service)}
              >
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <View style={styles.priceTag}>
                    <Text style={styles.priceText}>
                      ${Math.min(...Object.values(service.pricing))}+
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.serviceDescription} numberOfLines={2}>
                  {service.description}
                </Text>

                <View style={styles.serviceFooter}>
                  <View style={styles.deliveryTime}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.deliveryText}>{service.deliveryTime}</Text>
                  </View>
                  
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{service.category}</Text>
                  </View>
                </View>

                <View style={styles.serviceArrow}>
                  <Ionicons name="chevron-forward" size={20} color="#EA7C25" />
                </View>
              </TouchableOpacity>
            ))}

            {filteredServices?.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={64} color="#ccc" />
                <Text style={styles.emptyStateText}>No services found</Text>
                <Text style={styles.emptyStateSubtext}>
                  Try different keywords or adjust your filters
                </Text>
                <TouchableOpacity
                  style={styles.clearFiltersButton}
                  onPress={() => {
                    setSearchQuery('');
                    setSortBy('relevance');
                    setPriceRange('all');
                  }}
                >
                  <Text style={styles.clearFiltersText}>Clear all filters</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>Browse by Category</Text>
            {categories?.map((category: any) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => {
                  navigation.navigate('Services' as never, { categoryId: category.id } as never);
                }}
              >
                <View style={styles.categoryIcon}>
                  <Ionicons name="folder-outline" size={24} color="#EA7C25" />
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDesc}>{category.description}</Text>
                </View>
                <View style={styles.categoryCount}>
                  <Text style={styles.countText}>{category.serviceCount}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchHeader: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    marginRight: 8,
  },
  popularSection: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  popularTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  popularTag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  popularTagText: {
    fontSize: 14,
    color: '#666',
  },
  filtersContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    maxHeight: 60,
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  filterLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  filterChip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#EA7C25',
  },
  filterChipText: {
    fontSize: 12,
    color: '#666',
  },
  filterChipTextActive: {
    color: 'white',
  },
  resultsContainer: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  resultsHeader: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  priceTag: {
    backgroundColor: '#f0f8ff',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EA7C25',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  categoryTag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  serviceArrow: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
  },
  clearFiltersButton: {
    backgroundColor: '#EA7C25',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 16,
  },
  clearFiltersText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesSection: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  categoryDesc: {
    fontSize: 14,
    color: '#666',
  },
  categoryCount: {
    backgroundColor: '#EA7C25',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  countText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});