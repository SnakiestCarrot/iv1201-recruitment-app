import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ApplicationForm } from '../views/ApplicationForm';
import { useApplicationPresenter } from '../presenters/useApplicationPresenter';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../presenters/useApplicationPresenter');

describe('ApplicationForm Component', () => {
  const mockSetCurrentCompetenceId = vi.fn();
  const mockSetCurrentYoe = vi.fn();
  const mockSetCurrentFromDate = vi.fn();
  const mockSetCurrentToDate = vi.fn();
  const mockHandleInfoChange = vi.fn();
  const mockAddCompetence = vi.fn();
  const mockRemoveCompetence = vi.fn();
  const mockAddAvailability = vi.fn();
  const mockRemoveAvailability = vi.fn();
  const mockSubmitApplication = vi.fn();

  const getDefaultPresenterState = () => ({
    availableCompetences: [
      { competenceId: 1, name: 'JavaScript' },
      { competenceId: 2, name: 'Python' },
    ],
    status: 'idle',
    errorMessage: '',
    initialLoadDone: true,
    personalInfo: {
      name: '',
      surname: '',
    },
    addedCompetences: [],
    addedAvailabilities: [],
    currentCompetenceId: '',
    currentYoe: '',
    currentFromDate: '',
    currentToDate: '',
    errors: {},
    setCurrentCompetenceId: mockSetCurrentCompetenceId,
    setCurrentYoe: mockSetCurrentYoe,
    setCurrentFromDate: mockSetCurrentFromDate,
    setCurrentToDate: mockSetCurrentToDate,
    handleInfoChange: mockHandleInfoChange,
    addCompetence: mockAddCompetence,
    removeCompetence: mockRemoveCompetence,
    addAvailability: mockAddAvailability,
    removeAvailability: mockRemoveAvailability,
    submitApplication: mockSubmitApplication,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    (useApplicationPresenter as any).mockReturnValue(getDefaultPresenterState());
  });

  it('renders the application form correctly', () => {
    render(<ApplicationForm />);

    expect(screen.getByText('application.title')).toBeInTheDocument();
    expect(screen.getByText('application.personal-details')).toBeInTheDocument();
    expect(screen.getByText('application.competence-profile')).toBeInTheDocument();
    expect(screen.getByText('application.availability')).toBeInTheDocument();
  });

  it('renders personal information input fields', () => {
    render(<ApplicationForm />);

    expect(screen.getByPlaceholderText('application.name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('application.surname')).toBeInTheDocument();
  });

  it('calls handleInfoChange when typing in personal info fields', () => {
    render(<ApplicationForm />);

    const nameInput = screen.getByPlaceholderText('application.name');
    fireEvent.change(nameInput, { target: { value: 'John' } });

    expect(mockHandleInfoChange).toHaveBeenCalled();
  });

  it('renders competence dropdown with available competences', () => {
    render(<ApplicationForm />);

    expect(screen.getByText('application.select-competence')).toBeInTheDocument();
    
    const jsOptions = screen.getAllByText('competence.JavaScript');
    expect(jsOptions.length).toBeGreaterThan(0);
    
    const pythonOptions = screen.getAllByText('competence.Python');
    expect(pythonOptions.length).toBeGreaterThan(0);
  });

  it('calls setCurrentCompetenceId when competence is selected', () => {
    render(<ApplicationForm />);

    const select = screen.getByDisplayValue('application.select-competence');
    fireEvent.change(select, { target: { value: '1' } });

    expect(mockSetCurrentCompetenceId).toHaveBeenCalledWith('1');
  });

  it('calls setCurrentYoe when years of experience is entered', () => {
    render(<ApplicationForm />);

    const yoeInput = screen.getByPlaceholderText('application.years-exp');
    fireEvent.change(yoeInput, { target: { value: '5' } });

    expect(mockSetCurrentYoe).toHaveBeenCalledWith('5');
  });

  it('calls addCompetence when add button is clicked', () => {
    render(<ApplicationForm />);

    const addButtons = screen.getAllByText('application.add');
    fireEvent.click(addButtons[0]);

    expect(mockAddCompetence).toHaveBeenCalledTimes(1);
  });

  it('displays added competences', () => {
    (useApplicationPresenter as any).mockReturnValue({
      ...getDefaultPresenterState(),
      addedCompetences: [
        { competenceId: 1, yearsOfExperience: 3, name: 'JavaScript' },
        { competenceId: 2, yearsOfExperience: 2, name: 'Python' },
      ],
    });

    render(<ApplicationForm />);

    const jsElements = screen.getAllByText(/competence\.JavaScript/);
    expect(jsElements.length).toBeGreaterThan(0);

    const pyElements = screen.getAllByText(/competence\.Python/);
    expect(pyElements.length).toBeGreaterThan(0);

    expect(screen.getByText(/3\s+application\.years-exp/)).toBeInTheDocument();
    expect(screen.getByText(/2\s+application\.years-exp/)).toBeInTheDocument();
  });

  it('calls removeCompetence when remove button is clicked', () => {
    (useApplicationPresenter as any).mockReturnValue({
      ...getDefaultPresenterState(),
      addedCompetences: [
        { competenceId: 1, yearsOfExperience: 3, name: 'JavaScript' },
      ],
    });

    render(<ApplicationForm />);

    const removeButtons = screen.getAllByText('application.remove');
    fireEvent.click(removeButtons[0]);

    expect(mockRemoveCompetence).toHaveBeenCalledWith(0);
  });

  it('does not display competence list when none are added', () => {
    render(<ApplicationForm />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders availability date inputs', () => {
    render(<ApplicationForm />);

    expect(screen.getByText('application.from')).toBeInTheDocument();
    expect(screen.getByText('application.to')).toBeInTheDocument();

    const dateInputs = screen.getAllByDisplayValue('');
    expect(dateInputs.length).toBeGreaterThan(0);
  });

  it('calls setCurrentFromDate when from date is changed', () => {
    render(<ApplicationForm />);

    const dateInputs = screen.getAllByDisplayValue('');
    const fromDateInput = dateInputs.find(
      (input) => (input as HTMLInputElement).type === 'date'
    );

    if (fromDateInput) {
      fireEvent.change(fromDateInput, { target: { value: '2026-03-01' } });
      expect(mockSetCurrentFromDate).toHaveBeenCalledWith('2026-03-01');
    }
  });

  it('calls setCurrentToDate when to date is changed', () => {
    render(<ApplicationForm />);

    const inputs = screen.getAllByDisplayValue('');
    const dateInputs = inputs.filter(
      (input) => (input as HTMLInputElement).type === 'date'
    );
    const toDateInput = dateInputs[1];

    if (toDateInput) {
      fireEvent.change(toDateInput, { target: { value: '2026-06-01' } });
      expect(mockSetCurrentToDate).toHaveBeenCalledWith('2026-06-01');
    } else {
      throw new Error('To Date input not found');
    }
  });

  it('calls addAvailability when add button is clicked', () => {
    render(<ApplicationForm />);

    const addButtons = screen.getAllByText('application.add');
    fireEvent.click(addButtons[1]); 

    expect(mockAddAvailability).toHaveBeenCalledTimes(1);
  });

  it('displays added availabilities', () => {
    (useApplicationPresenter as any).mockReturnValue({
      ...getDefaultPresenterState(),
      addedAvailabilities: [
        { fromDate: '2026-03-01', toDate: '2026-06-01' },
        { fromDate: '2026-07-01', toDate: '2026-09-01' },
      ],
    });

    render(<ApplicationForm />);

    expect(screen.getByText('2026-03-01 → 2026-06-01')).toBeInTheDocument();
    expect(screen.getByText('2026-07-01 → 2026-09-01')).toBeInTheDocument();
  });

  it('calls removeAvailability when remove button is clicked', () => {
    (useApplicationPresenter as any).mockReturnValue({
      ...getDefaultPresenterState(),
      addedAvailabilities: [
        { fromDate: '2026-03-01', toDate: '2026-06-01' },
      ],
    });

    render(<ApplicationForm />);

    const removeButtons = screen.getAllByText('application.remove');
    fireEvent.click(removeButtons[0]);

    expect(mockRemoveAvailability).toHaveBeenCalledWith(0);
  });

  it('does not display availability list when none are added', () => {
    render(<ApplicationForm />);
    expect(screen.queryByText(/→/)).not.toBeInTheDocument();
  });

  it('calls submitApplication when form is submitted', () => {
    render(<ApplicationForm />);

    const form = screen.getByRole('button', { name: 'application.submit' }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(mockSubmitApplication).toHaveBeenCalledTimes(1);
  });

  it('disables submit button and shows loading text when status is loading', () => {
    (useApplicationPresenter as any).mockReturnValue({
      ...getDefaultPresenterState(),
      status: 'loading',
    });

    render(<ApplicationForm />);

    const submitButton = screen.getByRole('button', {
      name: 'application.submitting',
    });

    expect(submitButton).toBeDisabled();
  });

  it('displays error message when status is error', () => {
    (useApplicationPresenter as any).mockReturnValue({
      ...getDefaultPresenterState(),
      status: 'error',
      errorMessage: 'application.error-message', 
    });

    render(<ApplicationForm />);

    expect(screen.getByText('application.error-message')).toBeInTheDocument();
  });

  it('displays success message when status is success', () => {
    (useApplicationPresenter as any).mockReturnValue({
      ...getDefaultPresenterState(),
      status: 'success',
    });

    render(<ApplicationForm />);

    expect(screen.getByText('application.success-title')).toBeInTheDocument();
    expect(screen.getByText('application.success-message')).toBeInTheDocument();

  });
});