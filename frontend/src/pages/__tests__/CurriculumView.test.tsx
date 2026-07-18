import { vi, describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CurriculumView } from '../CurriculumView';
import * as lessonsApi from '@/api/lessons';

// Mock the lessons API module
vi.mock('@/api/lessons', () => ({
  useSutras: vi.fn(),
}));

// Mock the stats API module
vi.mock('@/api/stats', () => ({
  useProgress: vi.fn(() => ({
    data: undefined,
    isLoading: false,
  })),
}));

const mockSutras = [
  {
    id: "sutra-1",
    sutraId: 1,
    name: "Ekadhikena Purvena",
    sanskritName: "एकाधिकेन पूर्वेण",
    description: "By one more than the previous",
    order: 1,
    difficulty: "easy",
    estimatedHours: 5.0,
    icon: "➕",
    color: "#6366f1",
    slug: "ekadhikena-purvena",
  },
  {
    id: "sutra-2",
    sutraId: 2,
    name: "Nikhilam Navatashcaramam Dashatah",
    sanskritName: "निखिलं नवतश्चरमं दशतः",
    description: "All from 9 and the last from 10",
    order: 2,
    difficulty: "easy",
    estimatedHours: 4.5,
    icon: "➖",
    color: "#ec4899",
    slug: "nikhilam",
  }
];

describe('CurriculumView Page TDD', () => {
  it('should render loading spinner when isLoading is true', () => {
    vi.mocked(lessonsApi.useSutras).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    render(<CurriculumView navigateToLesson={vi.fn()} />);
    expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner has status role or equivalent
  });

  it('should render the list of sutras when loaded successfully', () => {
    vi.mocked(lessonsApi.useSutras).mockReturnValue({
      data: mockSutras,
      isLoading: false,
      error: null,
    } as any);

    render(<CurriculumView navigateToLesson={vi.fn()} />);

    // Check headings
    expect(screen.getByText('16 Vedic Sutras')).toBeInTheDocument();
    
    // Check sutra details
    expect(screen.getByText('Ekadhikena Purvena')).toBeInTheDocument();
    expect(screen.getByText('Nikhilam Navatashcaramam Dashatah')).toBeInTheDocument();
    
    // Check icons
    expect(screen.getByText('➕')).toBeInTheDocument();
    expect(screen.getByText('➖')).toBeInTheDocument();
  });

  it('should call navigateToLesson when a sutra card is clicked', () => {
    const mockNavigate = vi.fn();
    vi.mocked(lessonsApi.useSutras).mockReturnValue({
      data: mockSutras,
      isLoading: false,
      error: null,
    } as any);

    render(<CurriculumView navigateToLesson={mockNavigate} />);

    const card = screen.getByText('Ekadhikena Purvena').closest('.sutra-card') || screen.getByText('Ekadhikena Purvena').closest('div');
    expect(card).toBeInTheDocument();
    
    if (card) {
      fireEvent.click(card);
      expect(mockNavigate).toHaveBeenCalledWith('sutra-1');
    }
  });
});
