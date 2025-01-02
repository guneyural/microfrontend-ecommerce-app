const mockDispatchResult = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve()),
}));

export const useAppDispatch = jest.fn(() => mockDispatchResult);
export const useAppSelector = jest.fn();
