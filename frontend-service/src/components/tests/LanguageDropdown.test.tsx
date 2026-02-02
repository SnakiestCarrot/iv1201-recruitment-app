import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageDropdown } from '../LanguageDropdown';

const mockChangeLanguage = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      changeLanguage: mockChangeLanguage,
      language: 'en',
    },
  }),
}));

describe('LanguageDropdown Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
    });
    vi.stubGlobal('document', {
      documentElement: { lang: '' },
    });
  });

  it('renders language dropdown with label', () => {
    render(<LanguageDropdown />);

    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders English and Swedish options', () => {
    render(<LanguageDropdown />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;

    expect(select).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Svenska')).toBeInTheDocument();
  });

  it('defaults to English when language is en', () => {
    render(<LanguageDropdown />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;

    expect(select.value).toBe('en');
  });

  it('defaults to Swedish when language starts with sv', () => {
    vi.doMock('react-i18next', () => ({
      useTranslation: () => ({
        i18n: {
          changeLanguage: mockChangeLanguage,
          language: 'sv-SE',
        },
      }),
    }));

    render(<LanguageDropdown />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;

    expect(select.value).toBe('sv');
  });

  it('changes language when option is selected', () => {
    render(<LanguageDropdown />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;

    fireEvent.change(select, { target: { value: 'sv' } });

    expect(localStorage.setItem).toHaveBeenCalledWith('lang', 'sv');
  });

  it('updates document language attribute when language is changed', () => {
    const mockDocElement = { lang: '' };
    vi.stubGlobal('document', {
      documentElement: mockDocElement,
    });

    render(<LanguageDropdown />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;

    fireEvent.change(select, { target: { value: 'sv' } });

    expect(mockDocElement.lang).toBe('sv');
  });

  it('calls i18n changeLanguage when language is selected', () => {
    render(<LanguageDropdown />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;

    fireEvent.change(select, { target: { value: 'sv' } });

    expect(mockChangeLanguage).toHaveBeenCalledWith('sv');
  });

  it('has correct CSS classes applied', () => {
    render(<LanguageDropdown />);

    const container = screen.getByText('Language').parentElement;
    const select = screen.getByRole('combobox');

    expect(container).toHaveClass('language-dropdown-label');
    expect(select).toHaveClass('language-dropdown-select');
  });
});
