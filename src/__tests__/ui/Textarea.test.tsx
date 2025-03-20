import { render, screen, fireEvent } from '@testing-library/react'
import { Textarea } from '@/modules/common/components/ui/Textarea'
import '../test-utils'

describe('Textarea', () => {
  it('renders textarea element correctly', () => {
    render(<Textarea placeholder="Enter description" />)
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Textarea label="Description" />)
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
  })

  it('handles user input correctly', () => {
    const handleChange = jest.fn()
    render(<Textarea onChange={handleChange} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'test content' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(textarea).toHaveValue('test content')
  })

  it('shows error state correctly', () => {
    render(
      <Textarea
        error
        helperText="This field is required"
        label="Bio"
      />
    )
    
    const textarea = screen.getByLabelText('Bio')
    const helperText = screen.getByText('This field is required')
    
    expect(textarea).toHaveClass('border-red-500')
    expect(helperText).toHaveClass('text-red-500')
  })

  it('shows helper text with correct styling', () => {
    const { rerender } = render(
      <Textarea helperText="Helper text" />
    )
    
    expect(screen.getByText('Helper text')).toHaveClass('text-gray-500')
    
    rerender(<Textarea helperText="Error text" error />)
    expect(screen.getByText('Error text')).toHaveClass('text-red-500')
  })

  it('applies fullWidth class when fullWidth prop is true', () => {
    render(<Textarea fullWidth />)
    const textarea = screen.getByRole('textbox')
    const container = textarea.parentElement

    expect(textarea).toHaveClass('w-full')
    expect(container).toHaveClass('w-full')
  })

  it('handles disabled state correctly', () => {
    render(<Textarea disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('generates correct id from label', () => {
    render(<Textarea label="User Bio" />)
    const textarea = screen.getByLabelText('User Bio')
    expect(textarea).toHaveAttribute('id', 'user-bio')
  })

  it('uses provided id over generated one', () => {
    render(<Textarea id="custom-id" label="User Bio" />)
    const textarea = screen.getByLabelText('User Bio')
    expect(textarea).toHaveAttribute('id', 'custom-id')
  })

  it('applies custom className', () => {
    render(<Textarea className="custom-class" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-class')
  })

  it('forwards additional HTML attributes', () => {
    render(
      <Textarea
        maxLength={200}
        placeholder="Type here"
        required
        rows={4}
      />
    )
    
    const textarea = screen.getByPlaceholderText('Type here')
    expect(textarea).toHaveAttribute('maxLength', '200')
    expect(textarea).toHaveAttribute('required')
    expect(textarea).toHaveAttribute('rows', '4')
  })

  it('has minimum height by default', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox')).toHaveClass('min-h-[80px]')
  })
})
