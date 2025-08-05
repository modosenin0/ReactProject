import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import SearchBar from './SearchBar'

describe('SearchBar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search input with correct placeholder', () => {
    const mockOnSearch = vi.fn()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const searchInput = screen.getByPlaceholderText('Search GitHub repositories...')
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveAttribute('aria-label', 'Search GitHub repositories')
  })

  it('debounces search calls and triggers onSearch after 500ms delay', async () => {
    const mockOnSearch = vi.fn()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const searchInput = screen.getByPlaceholderText('Search GitHub repositories...')
    
    // Type quickly - should not trigger search immediately
    fireEvent.change(searchInput, { target: { value: 'react' } })
    expect(mockOnSearch).not.toHaveBeenCalled()
    
    // Wait for debounce delay
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('react')
    }, { timeout: 600 })
    
    expect(mockOnSearch).toHaveBeenCalledTimes(1)
  })

  it('cancels previous debounced call when input changes quickly', async () => {
    const mockOnSearch = vi.fn()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const searchInput = screen.getByPlaceholderText('Search GitHub repositories...')
    
    // Type quickly multiple times
    fireEvent.change(searchInput, { target: { value: 'r' } })
    fireEvent.change(searchInput, { target: { value: 're' } })
    fireEvent.change(searchInput, { target: { value: 'rea' } })
    fireEvent.change(searchInput, { target: { value: 'react' } })
    
    // Only the final value should be searched after debounce
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('react')
    }, { timeout: 600 })
    
    expect(mockOnSearch).toHaveBeenCalledTimes(1)
    expect(mockOnSearch).toHaveBeenCalledWith('react')
  })

  it('does not trigger search for empty or whitespace-only input', async () => {
    const mockOnSearch = vi.fn()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const searchInput = screen.getByPlaceholderText('Search GitHub repositories...')
    
    // Test empty string
    fireEvent.change(searchInput, { target: { value: '' } })
    await new Promise(resolve => setTimeout(resolve, 600))
    expect(mockOnSearch).not.toHaveBeenCalled()
    
    // Test whitespace only
    fireEvent.change(searchInput, { target: { value: '   ' } })
    await new Promise(resolve => setTimeout(resolve, 600))
    expect(mockOnSearch).not.toHaveBeenCalled()
  })

  it('trims whitespace from search query', async () => {
    const mockOnSearch = vi.fn()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const searchInput = screen.getByPlaceholderText('Search GitHub repositories...')
    
    fireEvent.change(searchInput, { target: { value: '  react  ' } })
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('react')
    }, { timeout: 600 })
  })

  it('shows clear button when input has value', () => {
    const mockOnSearch = vi.fn()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const searchInput = screen.getByPlaceholderText('Search GitHub repositories...')
    
    // Initially no clear button
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()
    
    // Type something
    fireEvent.change(searchInput, { target: { value: 'react' } })
    
    // Clear button should appear
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
  })

  it('clears input when clear button is clicked', () => {
    const mockOnSearch = vi.fn()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const searchInput = screen.getByPlaceholderText('Search GitHub repositories...')
    
    // Type something
    fireEvent.change(searchInput, { target: { value: 'react' } })
    expect(searchInput).toHaveValue('react')
    
    // Click clear button
    const clearButton = screen.getByLabelText('Clear search')
    fireEvent.click(clearButton)
    
    // Input should be cleared
    expect(searchInput).toHaveValue('')
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()
  })

  it('updates input value correctly when typing', () => {
    const mockOnSearch = vi.fn()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const searchInput = screen.getByPlaceholderText('Search GitHub repositories...')
    
    fireEvent.change(searchInput, { target: { value: 'typescript' } })
    expect(searchInput).toHaveValue('typescript')
  })
})
