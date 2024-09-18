import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";

// Define the shape of the context value
interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

// Create the context with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Define the type for AuthProvider's props
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component that will wrap around the app
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // For handling async loading state

  // API call to check authentication status
  const checkAuthStatus = async () => {
    try {
      setLoading(true); // Start loading

      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/api/users/profile`,
        {
          method: "GET",
          credentials: "include" // Include credentials (cookies or tokens)
        }
      );

      const data = await response.json();
      if (response.ok && data.isSuccess) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking authentication status:", error);
      setIsAuthenticated(false); // If the API call fails, consider the user not authenticated
    } finally {
      setLoading(false); // Finish loading
    }
  };

  // Call the API when the component is mounted to check auth status
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    // console.log(email, password);
    try {
      const body = { email: email, password: password };
      const login = await fetch(
        `${import.meta.env.VITE_SERVER}/api/users/login`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
      const response = await login.json();
      if (response.isSuccess) {
      }
    } catch (error) {}

    setIsAuthenticated(true);
  }; // Function to login
  const logout = () => setIsAuthenticated(false); // Function to logout

  const value: AuthContextType = {
    isAuthenticated,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
