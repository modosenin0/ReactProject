import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import SearchBar from './SearchBar'
import SortOptions from './SortOptions'
import Pagination from './Pagination'

describe('Component Integration Tests - Key Functionality', () => {
  describe('✅ SearchBar: debouncing and onSearch trigger', () => {
    it('debounces user input and triggers onSearch callback', async () => {
      const mockOnSearch = vi.fn()
      render(<SearchBar onSearch={mockOnSearch} />)
      
      const searchInput = screen.getByPlaceholderText('Search GitHub repositories...')
      
      // Type query
      fireEvent.change(searchInput, { target: { value: 'react typescript' } })
      
      // Should debounce and call onSearch after delay
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('react typescript')
      }, { timeout: 600 })
      
      expect(mockOnSearch).toHaveBeenCalledTimes(1)
    })

    it('prevents search for empty/whitespace input', async () => {
      const mockOnSearch = vi.fn()
      render(<SearchBar onSearch={mockOnSearch} />)
      
      const searchInput = screen.getByPlaceholderText('Search GitHub repositories...')
      
      // Test empty and whitespace inputs
      fireEvent.change(searchInput, { target: { value: '' } })
      fireEvent.change(searchInput, { target: { value: '   ' } })
      
      await new Promise(resolve => setTimeout(resolve, 600))
      expect(mockOnSearch).not.toHaveBeenCalled()
    })
  })

  describe('✅ SortOptions: changes sort order', () => {
    it('changes sort criteria correctly', () => {
      const mockSetSort = vi.fn()
      const mockSetOrder = vi.fn()
      
      render(
        <SortOptions 
          sort="stars" 
          setSort={mockSetSort}
          order="desc" 
          setOrder={mockSetOrder} 
        />
      )
      
      // Change sort from stars to forks
      const sortSelect = screen.getByLabelText('Sort repositories by')
      fireEvent.change(sortSelect, { target: { value: 'forks' } })
      expect(mockSetSort).toHaveBeenCalledWith('forks')
      
      // Change order from desc to asc
      const orderSelect = screen.getByLabelText('Sort order')
      fireEvent.change(orderSelect, { target: { value: 'asc' } })
      expect(mockSetOrder).toHaveBeenCalledWith('asc')
    })

    it('maintains independent control of sort and order', () => {
      const mockSetSort = vi.fn()
      const mockSetOrder = vi.fn()
      
      render(
        <SortOptions 
          sort="updated" 
          setSort={mockSetSort}
          order="asc" 
          setOrder={mockSetOrder} 
        />
      )
      
      // Changing sort should not affect order
      const sortSelect = screen.getByLabelText('Sort repositories by')
      fireEvent.change(sortSelect, { target: { value: 'stars' } })
      
      expect(mockSetSort).toHaveBeenCalledWith('stars')
      expect(mockSetOrder).not.toHaveBeenCalled()
    })
  })

  describe('✅ Pagination: Next/Previous page updates', () => {
    it('updates page when clicking Next and Previous buttons', () => {
      const mockSetPage = vi.fn()
      
      render(
        <Pagination 
          page={5} 
          setPage={mockSetPage}
          hasNextPage={true}
          totalCount={200}
        />
      )
      
      // Click Previous button
      const prevButton = screen.getByLabelText('Go to previous page')
      fireEvent.click(prevButton)
      expect(mockSetPage).toHaveBeenCalledWith(4)
      
      mockSetPage.mockClear()
      
      // Click Next button
      const nextButton = screen.getByLabelText('Go to next page')
      fireEvent.click(nextButton)
      expect(mockSetPage).toHaveBeenCalledWith(6)
    })

    it('updates page when clicking specific page numbers', () => {
      const mockSetPage = vi.fn()
      
      render(
        <Pagination 
          page={1} 
          setPage={mockSetPage}
          hasNextPage={true}
          totalCount={100}
        />
      )
      
      // Click on page 3
      const page3Button = screen.getByLabelText('Go to page 3')
      fireEvent.click(page3Button)
      expect(mockSetPage).toHaveBeenCalledWith(3)
    })

    it('properly disables buttons at boundaries', () => {
      const mockSetPage = vi.fn()
      
      // Test first page
      const { rerender } = render(
        <Pagination 
          page={1} 
          setPage={mockSetPage}
          hasNextPage={true}
          totalCount={100}
        />
      )
      
      const prevButton = screen.getByLabelText('Go to previous page')
      expect(prevButton).toBeDisabled()
      
      // Test last page (no next page)
      rerender(
        <Pagination 
          page={10} 
          setPage={mockSetPage}
          hasNextPage={false}
          totalCount={100}
        />
      )
      
      const nextButton = screen.getByLabelText('Go to next page')
      expect(nextButton).toBeDisabled()
    })
  })
})
