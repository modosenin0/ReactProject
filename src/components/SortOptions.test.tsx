import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import SortOptions from './SortOptions'

describe('SortOptions Component', () => {
  const defaultProps = {
    sort: 'stars',
    setSort: vi.fn(),
    order: 'desc',
    setOrder: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders sort select with correct default value', () => {
    render(<SortOptions {...defaultProps} />)
    
    const sortSelect = screen.getByLabelText('Sort repositories by')
    expect(sortSelect).toBeInTheDocument()
    expect(sortSelect).toHaveValue('stars')
  })

  it('renders order select with correct default value', () => {
    render(<SortOptions {...defaultProps} />)
    
    const orderSelect = screen.getByLabelText('Sort order')
    expect(orderSelect).toBeInTheDocument()
    expect(orderSelect).toHaveValue('desc')
  })

  it('displays all sort options correctly', () => {
    render(<SortOptions {...defaultProps} />)
    
    const sortSelect = screen.getByLabelText('Sort repositories by')
    const options = Array.from(sortSelect.querySelectorAll('option'))
    
    expect(options).toHaveLength(3)
    expect(options[0]).toHaveTextContent('Stars')
    expect(options[0]).toHaveValue('stars')
    expect(options[1]).toHaveTextContent('Forks')
    expect(options[1]).toHaveValue('forks')
    expect(options[2]).toHaveTextContent('Recently Updated')
    expect(options[2]).toHaveValue('updated')
  })

  it('displays all order options correctly', () => {
    render(<SortOptions {...defaultProps} />)
    
    const orderSelect = screen.getByLabelText('Sort order')
    const options = Array.from(orderSelect.querySelectorAll('option'))
    
    expect(options).toHaveLength(2)
    expect(options[0]).toHaveTextContent('Descending')
    expect(options[0]).toHaveValue('desc')
    expect(options[1]).toHaveTextContent('Ascending')
    expect(options[1]).toHaveValue('asc')
  })

  it('calls setSort when sort selection changes', () => {
    const mockSetSort = vi.fn()
    render(<SortOptions {...defaultProps} setSort={mockSetSort} />)
    
    const sortSelect = screen.getByLabelText('Sort repositories by')
    fireEvent.change(sortSelect, { target: { value: 'forks' } })
    
    expect(mockSetSort).toHaveBeenCalledWith('forks')
    expect(mockSetSort).toHaveBeenCalledTimes(1)
  })

  it('calls setOrder when order selection changes', () => {
    const mockSetOrder = vi.fn()
    render(<SortOptions {...defaultProps} setOrder={mockSetOrder} />)
    
    const orderSelect = screen.getByLabelText('Sort order')
    fireEvent.change(orderSelect, { target: { value: 'asc' } })
    
    expect(mockSetOrder).toHaveBeenCalledWith('asc')
    expect(mockSetOrder).toHaveBeenCalledTimes(1)
  })

  it('changes sort order correctly from desc to asc', () => {
    const mockSetOrder = vi.fn()
    render(<SortOptions {...defaultProps} setOrder={mockSetOrder} />)
    
    const orderSelect = screen.getByLabelText('Sort order')
    
    // Initially should be 'desc'
    expect(orderSelect).toHaveValue('desc')
    
    // Change to ascending
    fireEvent.change(orderSelect, { target: { value: 'asc' } })
    expect(mockSetOrder).toHaveBeenCalledWith('asc')
  })

  it('changes sort order correctly from asc to desc', () => {
    const mockSetOrder = vi.fn()
    render(<SortOptions {...defaultProps} order="asc" setOrder={mockSetOrder} />)
    
    const orderSelect = screen.getByLabelText('Sort order')
    
    // Initially should be 'asc'
    expect(orderSelect).toHaveValue('asc')
    
    // Change to descending
    fireEvent.change(orderSelect, { target: { value: 'desc' } })
    expect(mockSetOrder).toHaveBeenCalledWith('desc')
  })

  it('changes sort criteria from stars to forks', () => {
    const mockSetSort = vi.fn()
    render(<SortOptions {...defaultProps} setSort={mockSetSort} />)
    
    const sortSelect = screen.getByLabelText('Sort repositories by')
    
    // Change from stars to forks
    fireEvent.change(sortSelect, { target: { value: 'forks' } })
    expect(mockSetSort).toHaveBeenCalledWith('forks')
  })

  it('changes sort criteria from stars to recently updated', () => {
    const mockSetSort = vi.fn()
    render(<SortOptions {...defaultProps} setSort={mockSetSort} />)
    
    const sortSelect = screen.getByLabelText('Sort repositories by')
    
    // Change from stars to updated
    fireEvent.change(sortSelect, { target: { value: 'updated' } })
    expect(mockSetSort).toHaveBeenCalledWith('updated')
  })

  it('renders correct labels', () => {
    render(<SortOptions {...defaultProps} />)
    
    expect(screen.getByText('Sort By')).toBeInTheDocument()
    expect(screen.getByLabelText('Sort repositories by')).toBeInTheDocument()
    expect(screen.getByLabelText('Sort order')).toBeInTheDocument()
  })

  it('maintains independent state for sort and order', () => {
    const mockSetSort = vi.fn()
    const mockSetOrder = vi.fn()
    render(<SortOptions {...defaultProps} setSort={mockSetSort} setOrder={mockSetOrder} />)
    
    const sortSelect = screen.getByLabelText('Sort repositories by')
    const orderSelect = screen.getByLabelText('Sort order')
    
    // Change sort
    fireEvent.change(sortSelect, { target: { value: 'forks' } })
    expect(mockSetSort).toHaveBeenCalledWith('forks')
    expect(mockSetOrder).not.toHaveBeenCalled()
    
    // Reset mocks
    vi.clearAllMocks()
    
    // Change order
    fireEvent.change(orderSelect, { target: { value: 'asc' } })
    expect(mockSetOrder).toHaveBeenCalledWith('asc')
    expect(mockSetSort).not.toHaveBeenCalled()
  })
})
