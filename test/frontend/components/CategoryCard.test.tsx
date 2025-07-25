import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryCard from '../../../client/src/components/ui/category-card';
import type { Category } from '../../../shared/schema';

// Mock wouter's Link component
vi.mock('wouter', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('CategoryCard Component', () => {
  const mockCategory: Category = {
    id: 'web-development',
    name: 'Web Development',
    description: 'Custom web application development',
    icon: 'fas fa-code',
    slug: 'web-development',
    serviceCount: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should render category information correctly', () => {
    render(<CategoryCard category={mockCategory} />);

    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Custom web application development')).toBeInTheDocument();
    expect(screen.getByText('8 Services')).toBeInTheDocument();
  });

  it('should render with correct link href', () => {
    render(<CategoryCard category={mockCategory} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/category/web-development');
  });

  it('should call onClick handler when clicked', () => {
    const mockOnClick = vi.fn();
    render(<CategoryCard category={mockCategory} onClick={mockOnClick} />);

    const categoryCard = screen.getByText('Web Development').closest('div');
    if (categoryCard) {
      fireEvent.click(categoryCard);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    }
  });

  it('should display correct icon', () => {
    render(<CategoryCard category={mockCategory} />);

    // The icon should be rendered as an emoji based on the icon mapping
    expect(screen.getByText('💻')).toBeInTheDocument();
  });

  it('should handle missing icon gracefully', () => {
    const categoryWithNoIcon: Category = {
      ...mockCategory,
      icon: 'unknown-icon',
    };

    render(<CategoryCard category={categoryWithNoIcon} />);

    // Should fall back to default icon
    expect(screen.getByText('🔧')).toBeInTheDocument();
  });

  it('should have hover effects classes', () => {
    render(<CategoryCard category={mockCategory} />);

    const categoryCard = screen.getByText('Web Development').closest('div');
    expect(categoryCard).toHaveClass('hover:shadow-lg');
    expect(categoryCard).toHaveClass('hover:-translate-y-1');
    expect(categoryCard).toHaveClass('cursor-pointer');
  });

  it('should display service count correctly for different numbers', () => {
    const categoryWithManyServices: Category = {
      ...mockCategory,
      serviceCount: 15,
    };

    render(<CategoryCard category={categoryWithManyServices} />);
    expect(screen.getByText('15 Services')).toBeInTheDocument();
  });

  it('should handle category with no services', () => {
    const categoryWithNoServices: Category = {
      ...mockCategory,
      serviceCount: 0,
    };

    render(<CategoryCard category={categoryWithNoServices} />);
    expect(screen.getByText('0 Services')).toBeInTheDocument();
  });
});