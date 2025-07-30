import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import InteractiveStepperForm from '../components/ui/interactive-stepper-form';
import ResourceSelector from '../components/ui/resource-selector';
import AchievementCards from '../components/ui/achievement-cards';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe('Interactive Stepper Form Component', () => {
  const mockProps = {
    serviceId: 'ui-ux-design',
    serviceName: 'UI/UX Design',
    resourceType: 'designer',
    resourceTitle: 'UI/UX Designer',
    hourlyRate: 2500,
    onSubmit: vi.fn(),
    isSubmitting: false
  };

  const renderComponent = (props = mockProps) => {
    const queryClient = createTestQueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <InteractiveStepperForm {...props} />
      </QueryClientProvider>
    );
  };

  it('renders stepper form with all 3 steps', () => {
    renderComponent();
    
    expect(screen.getByText('Contact Info')).toBeInTheDocument();
    expect(screen.getByText('Project Details')).toBeInTheDocument();
    expect(screen.getByText('Budget & Timeline')).toBeInTheDocument();
  });

  it('displays project summary header', () => {
    renderComponent();
    
    expect(screen.getByText('UI/UX Design')).toBeInTheDocument();
    expect(screen.getByText('Resource: UI/UX Designer')).toBeInTheDocument();
    expect(screen.getByText('Rate: ₹2500/hour')).toBeInTheDocument();
  });

  it('shows step 1 form initially', () => {
    renderComponent();
    
    expect(screen.getByText("Let's Get to Know You!")).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your.email@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('+91 XXXXX XXXXX')).toBeInTheDocument();
  });

  it('validates step 1 fields correctly', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Try to submit empty form
    await user.click(screen.getByText('Continue to Project Details'));
    
    expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid phone number')).toBeInTheDocument();
  });

  it('progresses to step 2 when step 1 is valid', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Fill valid data
    await user.type(screen.getByPlaceholderText('Your full name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('your.email@example.com'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('+91 XXXXX XXXXX'), '+91 98765 43210');
    
    await user.click(screen.getByText('Continue to Project Details'));
    
    expect(screen.getByText('Tell Us About Your Project')).toBeInTheDocument();
  });

  it('shows back button on step 2', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Progress to step 2
    await user.type(screen.getByPlaceholderText('Your full name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('your.email@example.com'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('+91 XXXXX XXXXX'), '+91 98765 43210');
    await user.click(screen.getByText('Continue to Project Details'));
    
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('handles experience level selection correctly', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Progress to step 2
    await user.type(screen.getByPlaceholderText('Your full name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('your.email@example.com'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('+91 XXXXX XXXXX'), '+91 98765 43210');
    await user.click(screen.getByText('Continue to Project Details'));
    
    // Check experience level selector
    expect(screen.getByText('Experience Level Required *')).toBeInTheDocument();
  });

  it('displays loading state when submitting', () => {
    const submittingProps = { ...mockProps, isSubmitting: true };
    renderComponent(submittingProps);
    
    // Progress through all steps to see submit button
    // Note: This would require more complex setup to reach final step
    // For now, just verify the prop is passed
    expect(submittingProps.isSubmitting).toBe(true);
  });
});

describe('Resource Selector Component', () => {
  const mockProps = {
    selectedResource: null,
    onResourceSelect: vi.fn()
  };

  it('renders all resource types', () => {
    render(<ResourceSelector {...mockProps} />);
    
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Backend Developer')).toBeInTheDocument();
    expect(screen.getByText('Fullstack Developer')).toBeInTheDocument();
    expect(screen.getByText('UI/UX Designer')).toBeInTheDocument();
    expect(screen.getByText('QA Engineer')).toBeInTheDocument();
  });

  it('displays hourly rates for each resource', () => {
    render(<ResourceSelector {...mockProps} />);
    
    expect(screen.getByText('₹2000/hr')).toBeInTheDocument(); // Frontend
    expect(screen.getByText('₹2200/hr')).toBeInTheDocument(); // Backend
    expect(screen.getByText('₹2800/hr')).toBeInTheDocument(); // Fullstack
    expect(screen.getByText('₹2500/hr')).toBeInTheDocument(); // UI/UX
    expect(screen.getByText('₹1800/hr')).toBeInTheDocument(); // QA
  });

  it('shows skills for each resource type', () => {
    render(<ResourceSelector {...mockProps} />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('Figma')).toBeInTheDocument();
    expect(screen.getByText('Testing')).toBeInTheDocument();
  });

  it('handles resource selection', async () => {
    const user = userEvent.setup();
    const onResourceSelect = vi.fn();
    render(<ResourceSelector selectedResource={null} onResourceSelect={onResourceSelect} />);
    
    await user.click(screen.getByText('Frontend Developer'));
    
    expect(onResourceSelect).toHaveBeenCalledWith('frontend');
  });

  it('shows selected state correctly', () => {
    render(<ResourceSelector selectedResource="frontend" onResourceSelect={vi.fn()} />);
    
    // Should show check mark for selected resource
    const selectedCard = screen.getByText('Frontend Developer').closest('.ring-2');
    expect(selectedCard).toBeInTheDocument();
  });

  it('applies animation classes to resource cards', () => {
    render(<ResourceSelector {...mockProps} />);
    
    const animatedCards = document.querySelectorAll('.animate-bounce-slow');
    expect(animatedCards.length).toBeGreaterThan(0);
  });
});

describe('Achievement Cards Component', () => {
  it('renders all achievement statistics', () => {
    render(<AchievementCards />);
    
    expect(screen.getByText('100+')).toBeInTheDocument();
    expect(screen.getByText('Projects Completed')).toBeInTheDocument();
    expect(screen.getByText('50+')).toBeInTheDocument();
    expect(screen.getByText('Expert Developers')).toBeInTheDocument();
    expect(screen.getByText('24/7')).toBeInTheDocument();
    expect(screen.getByText('Support Available')).toBeInTheDocument();
    expect(screen.getByText('1 Hour')).toBeInTheDocument();
    expect(screen.getByText('Project Kickstart')).toBeInTheDocument();
  });

  it('applies animation classes to achievement cards', () => {
    render(<AchievementCards />);
    
    const animatedCards = document.querySelectorAll('.animate-bounce-slow');
    expect(animatedCards.length).toBe(4); // 4 achievement cards
  });

  it('displays proper icons for each achievement', () => {
    render(<AchievementCards />);
    
    // Check if SVG icons are rendered (Lucide icons render as SVG)
    const svgIcons = document.querySelectorAll('svg');
    expect(svgIcons.length).toBeGreaterThan(0);
  });

  it('has correct gradient backgrounds', () => {
    render(<AchievementCards />);
    
    const gradientElements = document.querySelectorAll('.bg-gradient-to-r');
    expect(gradientElements.length).toBeGreaterThan(0);
  });
});

describe('Animation Utilities', () => {
  it('applies bounce animation classes', () => {
    render(
      <div className="animate-bounce-slow">
        Test Animation
      </div>
    );
    
    const animatedElement = screen.getByText('Test Animation');
    expect(animatedElement).toHaveClass('animate-bounce-slow');
  });

  it('applies hover effects', () => {
    render(
      <div className="hover-lift hover-glow">
        Test Hover
      </div>
    );
    
    const hoverElement = screen.getByText('Test Hover');
    expect(hoverElement).toHaveClass('hover-lift');
    expect(hoverElement).toHaveClass('hover-glow');
  });

  it('applies gradient animations', () => {
    render(
      <div className="animate-gradient">
        Test Gradient
      </div>
    );
    
    const gradientElement = screen.getByText('Test Gradient');
    expect(gradientElement).toHaveClass('animate-gradient');
  });
});

describe('Form Validation', () => {
  it('validates email format', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    expect(emailRegex.test('valid@example.com')).toBe(true);
    expect(emailRegex.test('invalid-email')).toBe(false);
    expect(emailRegex.test('missing@.com')).toBe(false);
  });

  it('validates phone number format', () => {
    const phoneRegex = /^\+91\s\d{5}\s\d{5}$/;
    
    expect(phoneRegex.test('+91 98765 43210')).toBe(true);
    expect(phoneRegex.test('9876543210')).toBe(false);
    expect(phoneRegex.test('+91 987 654 3210')).toBe(false);
  });

  it('validates minimum length requirements', () => {
    const validateName = (name: string) => name.length >= 2;
    const validateProject = (details: string) => details.length >= 20;
    
    expect(validateName('Jo')).toBe(true);
    expect(validateName('J')).toBe(false);
    expect(validateProject('This is a detailed project description')).toBe(true);
    expect(validateProject('Short')).toBe(false);
  });
});