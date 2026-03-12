import { describe, expect, it, vi } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderApp } from './test/renderWithStore'

vi.mock('./services/FileParserService', () => ({
  FileParserService: {
    parseFile: vi.fn(),
  },
}))

import App from './App'
import { FileParserService } from './services/FileParserService'

const parseFileMock = vi.mocked(FileParserService.parseFile)

describe('App', () => {
  it('renders clearer onboarding paths for first-time users', () => {
    renderApp(<App />)

    expect(screen.getByText(/import existing resume/i)).toBeInTheDocument()
    expect(
      screen.getByText(/open an empty resume and build section by section/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/finish your base draft first, then use ai tailoring/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /browse files/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /start with a blank resume/i }),
    ).toBeInTheDocument()
  })

  it('shows continuation and recovery actions after a successful import', async () => {
    parseFileMock.mockResolvedValueOnce('# Resume')
    const user = userEvent.setup()

    const { container } = renderApp(<App />)

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement | null
    const file = new File(['resume'], 'resume.md', { type: 'text/markdown' })

    expect(fileInput).not.toBeNull()
    await user.upload(fileInput as HTMLInputElement, file)

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /continue to editor/i }),
      ).toBeInTheDocument()
    })

    expect(screen.getByText(/successfully parsed/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /choose a different file/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /start with a blank resume/i }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /choose a different file/i }))

    expect(screen.getByRole('button', { name: /browse files/i })).toBeInTheDocument()
  })

  it('shows compact next-step guidance for first run and active tabs', async () => {
    const user = userEvent.setup()

    renderApp(<App />)

    expect(screen.getByText(/^recommended next step$/i)).toBeInTheDocument()
    expect(screen.getByText(/^import a resume or start blank$/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /start with a blank resume/i }))

    expect(screen.getByText(/tailor once your base resume is ready/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /content/i }))
    expect(screen.getByText(/edit your content/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /design/i }))
    expect(screen.getByText(/choose a template/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /export/i }))
    expect(screen.getByText(/export when ready/i)).toBeInTheDocument()
  })

  it('exposes accessible names for existing icon-only app controls', () => {
    renderApp(<App />)

    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /choose a resume template/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /close sidebar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /zoom out/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /zoom in/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /fit preview to 100% zoom/i })).toBeInTheDocument()
  })

  it('keeps the export buttons in a labeled responsive group', async () => {
    const user = userEvent.setup()

    renderApp(<App />)

    await user.click(screen.getByRole('button', { name: /export/i }))

    const exportSection = screen.getByTestId('export-actions')
    const grid = within(exportSection).getByRole('button', { name: /word/i }).parentElement
    const buttons = within(exportSection).getAllByRole('button')

    expect(grid).toHaveClass('export-actions-grid')
    expect(buttons.map((button) => button.textContent?.trim())).toEqual([
      'Print PDF',
      'Word',
      'Markdown',
      'HTML',
    ])
    expect(buttons.every((button) => button.classList.contains('export-action-button'))).toBe(true)
  })

  it('returns focus to the gallery trigger when the template gallery closes', async () => {
    const user = userEvent.setup()

    renderApp(<App />)

    const galleryTrigger = screen.getByRole('button', { name: /choose a resume template/i })

    await user.click(galleryTrigger)

    expect(screen.getByRole('dialog', { name: /choose a template/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /close template gallery/i }))

    expect(galleryTrigger).toHaveFocus()
  })
})
