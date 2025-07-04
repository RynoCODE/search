import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchBar from '../../components/SearchBar';

describe('SearchBar', () => {
    test('renders correctly', () => {
        render(<SearchBar />);
        const inputElement = screen.getByPlaceholderText(/search/i);
        expect(inputElement).toBeInTheDocument();
    });

    test('behaves as expected', () => {
        render(<SearchBar />);
        const inputElement = screen.getByPlaceholderText(/search/i);
        expect(inputElement).toHaveValue('');
        inputElement.value = 'test';
        expect(inputElement).toHaveValue('test');
    });
});