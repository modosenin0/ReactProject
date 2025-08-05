import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Pagination from './Pagination'

describe('Pagination Component', () => {
  const defaultProps = {
    page: 1,
    setPage: vi.fn(),
    hasNextPage: true,
    totalCount: 100
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders pagination with correct initial state', () => {
    render(<Pagination {...defaultProps} />)
    
    expect(screen.getByLabelText('Repository pagination')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to previous page')).toBeDisabled()
    expect(screen.getByLabelText('Go to next page')).not.toBeDisabled()
  })

  it('disables Previous button on first page', () => {
    render(<Pagination {...defaultProps} page={1} />)
    
    const prevButton = screen.getByLabelText('Go to previous page')
    expect(prevButton).toBeDisabled()
    expect(prevButton.closest('li')).toHaveClass('disabled')
  })

  it('enables Previous button when not on first page', () => {
    render(<Pagination {...defaultProps} page={2} />)
    
    const prevButton = screen.getByLabelText('Go to previous page')
    expect(prevButton).not.toBeDisabled()
    expect(prevButton.closest('li')).not.toHaveClass('disabled')
  })

  it('calls setPage with previous page when Previous button is clicked', () => {
    const mockSetPage = vi.fn()
    render(<Pagination {...defaultProps} page={3} setPage={mockSetPage} />)
    
    const prevButton = screen.getByLabelText('Go to previous page')
    fireEvent.click(prevButton)
    
    expect(mockSetPage).toHaveBeenCalledWith(2)
    expect(mockSetPage).toHaveBeenCalledTimes(1)
  })

  it('calls setPage with next page when Next button is clicked', () => {
    const mockSetPage = vi.fn()
    render(<Pagination {...defaultProps} page={1} setPage={mockSetPage} hasNextPage={true} />)
    
    const nextButton = screen.getByLabelText('Go to next page')
    fireEvent.click(nextButton)
    
    expect(mockSetPage).toHaveBeenCalledWith(2)
    expect(mockSetPage).toHaveBeenCalledTimes(1)
  })

  it('disables Next button when hasNextPage is false', () => {
    render(<Pagination {...defaultProps} hasNextPage={false} />)
    
    const nextButton = screen.getByLabelText('Go to next page')
    expect(nextButton).toBeDisabled()
    expect(nextButton.closest('li')).toHaveClass('disabled')
  })

  it('disables Next button when on page 100 (GitHub limit)', () => {
    render(<Pagination {...defaultProps} page={100} totalCount={2000} />)
    
    const nextButton = screen.getByLabelText('Go to next page')
    expect(nextButton).toBeDisabled()
    expect(nextButton.closest('li')).toHaveClass('disabled')
  })

  it('shows active state for current page', () => {
    render(<Pagination {...defaultProps} page={3} totalCount={100} />)
    
    const currentPageButton = screen.getByLabelText('Go to page 3')
    expect(currentPageButton.closest('li')).toHaveClass('active')
    expect(currentPageButton).toHaveAttribute('aria-current', 'page')
  })

  it('calls setPage when page number is clicked', () => {
    const mockSetPage = vi.fn()
    render(<Pagination {...defaultProps} page={1} setPage={mockSetPage} totalCount={100} />)
    
    const pageButton = screen.getByLabelText('Go to page 2')
    fireEvent.click(pageButton)
    
    expect(mockSetPage).toHaveBeenCalledWith(2)
    expect(mockSetPage).toHaveBeenCalledTimes(1)
  })

  it('displays ellipsis when there are many pages', () => {
    render(<Pagination {...defaultProps} page={50} totalCount={1000} />)
    
    const ellipsisList = screen.getAllByText('...')
    expect(ellipsisList.length).toBeGreaterThan(0)
  })

  it('shows first page when current page is far from start', () => {
    render(<Pagination {...defaultProps} page={50} totalCount={1000} />)
    
    expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument()
  })

  it('shows last page when current page is far from end', () => {
    render(<Pagination {...defaultProps} page={10} totalCount={1000} />)
    
    const lastPageButton = screen.getByLabelText('Go to page 100')
    expect(lastPageButton).toBeInTheDocument()
  })

  it('properly handles GitHub limits - respects 1000 item and 100 page limits', () => {
    // Test the actual behavior: even with 2000 totalCount, limited to 100 pages
    render(<Pagination {...defaultProps} totalCount={2000} />)
    
    // Should show page 100 but not beyond
    expect(screen.getByLabelText('Go to page 100')).toBeInTheDocument()
    expect(screen.queryByLabelText('Go to page 101')).not.toBeInTheDocument()
    
    // Test that maxResults is properly limited to 1000 (100 pages * 10 items per page)
    const lastPageButton = screen.getByLabelText('Go to page 100')
    expect(lastPageButton).toBeInTheDocument()
  })

  it('calculates total pages correctly', () => {
    // 95 items = 10 pages (10 items per page)
    render(<Pagination {...defaultProps} totalCount={95} />)
    
    // Should show pages 1-5 when on page 1
    expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument()
    expect(screen.queryByLabelText('Go to page 11')).not.toBeInTheDocument()
  })

  it('handles edge case with very low totalCount', () => {
    render(<Pagination {...defaultProps} totalCount={5} />)
    
    // With 5 items, only 1 page should exist
    expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument()
    expect(screen.queryByLabelText('Go to page 2')).not.toBeInTheDocument()
  })

  it('respects GitHub 1000 item limit', () => {
    render(<Pagination {...defaultProps} totalCount={2000} />)
    
    // Even with 2000 totalCount, should be limited to 100 pages max
    const lastPageButton = screen.getByLabelText('Go to page 100')
    expect(lastPageButton).toBeInTheDocument()
    expect(screen.queryByLabelText('Go to page 101')).not.toBeInTheDocument()
  })

  it('navigates to specific page correctly', () => {
    const mockSetPage = vi.fn()
    render(<Pagination {...defaultProps} page={1} setPage={mockSetPage} totalCount={100} />)
    
    // Click on page 4
    const page4Button = screen.getByLabelText('Go to page 4')
    fireEvent.click(page4Button)
    
    expect(mockSetPage).toHaveBeenCalledWith(4)
  })

  it('shows correct visible pages around current page', () => {
    render(<Pagination {...defaultProps} page={5} totalCount={200} />)
    
    // Should show pages around page 5
    expect(screen.getByLabelText('Go to page 3')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to page 4')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to page 5')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to page 6')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to page 7')).toBeInTheDocument()
  })

  it('updates page correctly when clicking Previous from page 5', () => {
    const mockSetPage = vi.fn()
    render(<Pagination {...defaultProps} page={5} setPage={mockSetPage} />)
    
    const prevButton = screen.getByLabelText('Go to previous page')
    fireEvent.click(prevButton)
    
    expect(mockSetPage).toHaveBeenCalledWith(4)
  })

  it('updates page correctly when clicking Next from page 5', () => {
    const mockSetPage = vi.fn()
    render(<Pagination {...defaultProps} page={5} setPage={mockSetPage} hasNextPage={true} />)
    
    const nextButton = screen.getByLabelText('Go to next page')
    fireEvent.click(nextButton)
    
    expect(mockSetPage).toHaveBeenCalledWith(6)
  })
})
