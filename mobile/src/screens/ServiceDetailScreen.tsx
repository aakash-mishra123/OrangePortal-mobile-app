import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { apiRequest, trackActivity } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
  techStack: string[];
}

export default function ServiceDetailScreen() {
  const route = useRoute();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'standard' | 'premium'>('basic');
  const [contactForm, setContactForm] = useState({
    companyName: '',
    requirements: '',
    budget: '',
  });

  const serviceId = (route.params as any)?.serviceId;

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => apiRequest(`/api/service/${serviceId}`),
    enabled: !!serviceId,
  });

  const contactMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/leads', 'POST', data);
    },
    onSuccess: () => {
      Alert.alert(
        'Success!',
        'Your inquiry has been submitted. Our team will contact you within 24 hours.',
        [{ text: 'OK', onPress: () => setShowContactModal(false) }]
      );
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setContactForm({ companyName: '', requirements: '', budget: '' });
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to submit inquiry');
    },
  });

  const handleContactSubmit = async () => {
    if (!contactForm.companyName.trim() || !contactForm.requirements.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    await trackActivity('contact_form_submit', { 
      serviceId: service.id,
      plan: selectedPlan 
    });

    contactMutation.mutate({
      serviceId: service.id,
      serviceName: service.title,
      selectedPlan,
      estimatedPrice: service.pricing[selectedPlan],
      companyName: contactForm.companyName,
      requirements: contactForm.requirements,
      budget: contactForm.budget,
      name: user ? `${user.firstName} ${user.lastName}` : 'Guest',
      email: user?.email || 'guest@email.com',
      mobile: user?.mobile || '',
    });
  };

  if (isLoading || !service) {
    return (
      <View style={styles.centered}>
        <Text>Loading service details...</Text>
      </View>
    );
  }

  const plans = [
    { key: 'basic', label: 'Basic', price: service.pricing.basic },
    { key: 'standard', label: 'Standard', price: service.pricing.standard },
    { key: 'premium', label: 'Premium', price: service.pricing.premium },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.title}>{service.title}</Text>
          <Text style={styles.description}>{service.description}</Text>
          
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.metaText}>{service.deliveryTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#EA7C25" />
              <Text style={styles.metaText}>{service.features.length} features included</Text>
            </View>
          </View>
        </View>

        {/* Pricing Plans */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          <View style={styles.pricingGrid}>
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.key}
                style={[
                  styles.pricingCard,
                  selectedPlan === plan.key && styles.pricingCardActive,
                ]}
                onPress={() => setSelectedPlan(plan.key as any)}
              >
                <Text style={styles.planLabel}>{plan.label}</Text>
                <Text style={styles.planPrice}>${plan.price}</Text>
                {selectedPlan === plan.key && (
                  <View style={styles.selectedBadge}>
                    <Ionicons name="checkmark-circle" size={20} color="#EA7C25" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's Included</Text>
          <View style={styles.featuresList}>
            {service.features.map((feature: string, index: number) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#EA7C25" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tech Stack */}
        {service.techStack && service.techStack.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technologies Used</Text>
            <View style={styles.techStack}>
              {service.techStack.map((tech: string, index: number) => (
                <View key={index} style={styles.techChip}>
                  <Text style={styles.techText}>{tech}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Contact CTA */}
      <View style={styles.bottomBar}>
        <View style={styles.priceInfo}>
          <Text style={styles.currentPrice}>
            ${service.pricing[selectedPlan]}
          </Text>
          <Text style={styles.priceLabel}>{selectedPlan} plan</Text>
        </View>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => setShowContactModal(true)}
        >
          <Text style={styles.contactButtonText}>Get Quote</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Modal */}
      <Modal
        visible={showContactModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Request Quote</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowContactModal(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.selectedServiceInfo}>
              <Text style={styles.selectedServiceText}>
                {service.title} - {selectedPlan} Plan
              </Text>
              <Text style={styles.selectedPriceText}>
                ${service.pricing[selectedPlan]}
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Company Name *</Text>
              <TextInput
                style={styles.formInput}
                value={contactForm.companyName}
                onChangeText={(text) =>
                  setContactForm({ ...contactForm, companyName: text })
                }
                placeholder="Enter your company name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Project Requirements *</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={contactForm.requirements}
                onChangeText={(text) =>
                  setContactForm({ ...contactForm, requirements: text })
                }
                placeholder="Describe your project requirements..."
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Budget Range</Text>
              <TextInput
                style={styles.formInput}
                value={contactForm.budget}
                onChangeText={(text) =>
                  setContactForm({ ...contactForm, budget: text })
                }
                placeholder="e.g., $10,000 - $25,000"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                contactMutation.isPending && styles.submitButtonDisabled,
              ]}
              onPress={handleContactSubmit}
              disabled={contactMutation.isPending}
            >
              <Text style={styles.submitButtonText}>
                {contactMutation.isPending ? 'Submitting...' : 'Submit Inquiry'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
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
  content: {
    flex: 1,
  },
  hero: {
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  pricingGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pricingCard: {
    flex: 0.3,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  pricingCardActive: {
    borderColor: '#EA7C25',
    backgroundColor: '#fff5f0',
  },
  planLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EA7C25',
  },
  selectedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techChip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  techText: {
    fontSize: 12,
    color: '#666',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  priceInfo: {
    flex: 1,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EA7C25',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  contactButton: {
    backgroundColor: '#EA7C25',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  selectedServiceInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedServiceText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  selectedPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EA7C25',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#EA7C25',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});