const mockNavigate = jest.fn();
export const useNavigate = () => mockNavigate;
export { Link, NavLink } from "react-router-dom";

// Export for test access
export { mockNavigate };
