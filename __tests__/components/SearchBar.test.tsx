import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../../components/SearchBar';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('SearchBar', () => {
    const mockOnSearchResults = jest.fn();

    beforeEach(() => {
        mockOnSearchResults.mockClear();
    });

    test('renders correctly', () => {
        render(<SearchBar onSearchResults={mockOnSearchResults} />);
        const inputElement = screen.getByPlaceholderText(/search/i);
        expect(inputElement).toBeInTheDocument();
    });

    test('updates input value on change', () => {
        render(<SearchBar onSearchResults={mockOnSearchResults} />);
        const inputElement = screen.getByPlaceholderText(/search/i);
        fireEvent.change(inputElement, { target: { value: 'test' } });
        expect(inputElement).toHaveValue('test');
    });

    test('renders search button', () => {
        render(<SearchBar onSearchResults={mockOnSearchResults} />);
        const buttonElement = screen.getByRole('button', { name: /search/i });
        expect(buttonElement).toBeInTheDocument();
    });
});