import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

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

    const signup = (name, email, password, role = 'customer') => {
        const newUser = { id: Date.now().toString(), name, email, password, role };
        setUsers(prev => [...prev, newUser]);
        return { success: true };
    };

    const login = (email, password) => {
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
            setUser(foundUser);
            return { success: true, user: foundUser };
        }
        return { success: false, message: 'Invalid email or password' };
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, users, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
