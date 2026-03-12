import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TemplateGallery from '../TemplateGallery'

describe('TemplateGallery', () => {
  it('renders an accessible dialog with real thumbnails and selected badge', () => {
    render(
      <TemplateGallery
        selectedTemplate="premium"
        onSelectTemplate={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    const dialog = screen.getByRole('dialog', { name: /choose a template/i })
    const premiumThumbnail = screen.getByAltText(
      /premium headshot resume template thumbnail preview/i,
    ) as HTMLImageElement

    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveFocus()
    expect(premiumThumbnail).toBeInTheDocument()
    expect(premiumThumbnail.getAttribute('src')).toContain('data:image/svg+xml')
    expect(premiumThumbnail.style.objectFit).toBe('contain')
    expect(screen.getByText(/selected/i)).toBeInTheDocument()
  })

  it('supports keyboard focus and selection on template buttons', async () => {
    const user = userEvent.setup()
    const onSelectTemplate = vi.fn()
    const onClose = vi.fn()

    render(
      <TemplateGallery
        selectedTemplate="classic"
        onSelectTemplate={onSelectTemplate}
        onClose={onClose}
      />,
    )

    const premiumButton = screen.getByRole('button', { name: /premium headshot/i })

    act(() => {
      premiumButton.focus()
    })

    expect(premiumButton).toHaveFocus()
    expect(premiumButton).toHaveAttribute('aria-pressed', 'false')

    await user.keyboard('{Enter}')

    expect(onSelectTemplate).toHaveBeenCalledWith('premium')
    expect(onClose).toHaveBeenCalled()
  })

  it('closes on escape and restores focus when a return target is provided', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const trigger = document.createElement('button')
    trigger.textContent = 'Open gallery'
    document.body.appendChild(trigger)
    trigger.focus()

    render(
      <TemplateGallery
        selectedTemplate="classic"
        onSelectTemplate={vi.fn()}
        onClose={onClose}
        returnFocusTo={trigger}
      />,
    )

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalled()
    expect(trigger).toHaveFocus()
    trigger.remove()
  })

  it('shows a fallback placeholder only after thumbnail load fails', () => {
    render(
      <TemplateGallery
        selectedTemplate="classic"
        onSelectTemplate={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    expect(screen.queryByText(/preview unavailable/i)).not.toBeInTheDocument()

    const classicThumbnail = screen.getByAltText(
      /classic minimal resume template thumbnail preview/i,
    )

    fireEvent.error(classicThumbnail)

    expect(screen.getByText(/preview unavailable/i)).toBeInTheDocument()
    expect(
      screen.getByLabelText(/classic minimal thumbnail unavailable/i),
    ).toBeInTheDocument()
  })
})
