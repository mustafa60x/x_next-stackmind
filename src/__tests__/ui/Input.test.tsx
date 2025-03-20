import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '@/modules/common/components/ui/Input'
import '../test-utils'

describe('Input', () => {
  it('renders input element correctly', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Input label="Username" />)
    expect(screen.getByText('Username')).toBeInTheDocument()
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
  })

  it('handles user input correctly', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue('test')
  })

  it('shows error state correctly', () => {
    render(
      <Input
        error
        helperText="This field is required"
        label="Email"
      />
    )
    
    const input = screen.getByLabelText('Email')
    const helperText = screen.getByText('This field is required')
    
    expect(input).toHaveClass('border-red-500')
    expect(helperText).toHaveClass('text-red-500')
  })

  it('shows helper text with correct styling', () => {
    const { rerender } = render(
      <Input helperText="Helper text" />
    )
    
    expect(screen.getByText('Helper text')).toHaveClass('text-gray-500')
    
    rerender(<Input helperText="Error text" error />)
    expect(screen.getByText('Error text')).toHaveClass('text-red-500')
  })

  it('applies fullWidth class when fullWidth prop is true', () => {
    render(<Input fullWidth />)
    const input = screen.getByRole('textbox')
    const container = input.parentElement

    expect(input).toHaveClass('w-full')
    expect(container).toHaveClass('w-full')
  })

  it('handles disabled state correctly', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('generates correct id from label', () => {
    render(<Input label="User Name" />)
    const input = screen.getByLabelText('User Name')
    expect(input).toHaveAttribute('id', 'user-name')
  })

  it('uses provided id over generated one', () => {
    render(<Input id="custom-id" label="User Name" />)
    const input = screen.getByLabelText('User Name')
    expect(input).toHaveAttribute('id', 'custom-id')
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-class')
  })

  it('forwards additional HTML attributes', () => {
    render(
      <Input
        maxLength={10}
        placeholder="Type here"
        required
        type="email"
      />
    )
    
    const input = screen.getByPlaceholderText('Type here')
    expect(input).toHaveAttribute('maxLength', '10')
    expect(input).toHaveAttribute('required')
    expect(input).toHaveAttribute('type', 'email')
  })
})
