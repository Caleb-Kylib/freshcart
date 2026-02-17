import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem('users');
        // Pre-seed an admin user for convenience
        const initialUsers = savedUsers ? JSON.parse(savedUsers) : [
            { id: '1', name: 'Admin User', email: 'admin@farmfresh.com', password: 'password', role: 'admin' }
        ];
        return initialUsers;
    });

    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [user]);

    // Cross-tab sync
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'users') {
                setUsers(JSON.parse(e.newValue || '[]'));
            }
            if (e.key === 'currentUser') {
                setUser(e.newValue ? JSON.parse(e.newValue) : null);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const signup = (name, email, password, role = 'customer') => {
        const newUser = { id: Date.now().toString(), name, email, password, role };
        setUsers(prev => [...prev, newUser]);
        return { success: true };
    };

    const login = (email, password, requiredRole = null) => {
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
            if (requiredRole && foundUser.role !== requiredRole) {
                return { success: false, message: `Access denied. This portal is for ${requiredRole}s only.` };
            }
            setUser(foundUser);
            return { success: true, user: foundUser };
        }
        return { success: false, message: 'Invalid email or password' };
    };

    const logout = () => {
        // Clear current session
        setUser(null);
        localStorage.removeItem('currentUser');

        // Optional: Call backend logout if needed
        fetch('/api/logout', { method: 'POST' }).catch(() => { });

        // Redirect to entry points
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, users, loading, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
