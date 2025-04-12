
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Mock user data for demonstration
const mockUsers = [
  {
    id: '1',
    email: 'student@emsi.ma',
    password: 'password',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    role: 'student' as UserRole,
    studentId: 'ST12345',
    department: 'Computer Science',
    year: '3rd Year',
    class: 'A',
    phoneNumber: '+212 612345678',
    address: '123 University Street, Casablanca',
    profileImage: '',
    absences: 12,
    justifiedAbsences: 8,
  },
  {
    id: '2',
    email: 'supervisor@emsi.ma',
    password: 'password',
    firstName: 'Mohammed',
    lastName: 'Alaoui',
    role: 'supervisor' as UserRole,
    profileImage: '',
  },
  // Adding the new email accounts
  {
    id: '3',
    email: 'etudiant@gmail.com',
    password: 'password', // This will match with any password
    firstName: 'Étudiant',
    lastName: 'EMSI',
    role: 'student' as UserRole,
    studentId: 'ST67890',
    department: 'Computer Science',
    year: '2nd Year',
    class: 'B',
    phoneNumber: '+212 612345679',
    address: '456 University Street, Casablanca',
    profileImage: '',
    absences: 8,
    justifiedAbsences: 4,
  },
  {
    id: '4',
    email: 'superviser@gmail.com',
    password: 'password', // This will match with any password
    firstName: 'Superviseur',
    lastName: 'EMSI',
    role: 'supervisor' as UserRole,
    profileImage: '',
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for stored user data when the component mounts
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Mock login API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find the user with the matching email and role
        const foundUser = mockUsers.find(
          (u) => u.email === email && u.role === role
        );

        if (foundUser) {
          // For the new emails, accept any password
          if (email === 'etudiant@gmail.com' || email === 'superviser@gmail.com' || foundUser.password === password) {
            // Remove password before storing
            const { password, ...userWithoutPassword } = foundUser;
            setUser(userWithoutPassword);
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
