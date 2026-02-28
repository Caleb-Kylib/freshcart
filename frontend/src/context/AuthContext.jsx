import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = '/api/auth';

    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, [token]);

    // Fetch users if logged in as admin
    useEffect(() => {
        if (user?.role === 'admin' && token) {
            fetchUsers();
        } else {
            setUsers([]);
        }
    }, [user, token]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const signup = async (name, email, password, role = 'customer') => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Signup failed');

            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            return { success: true };
        } catch (error) {
            const message = error.message === 'Failed to fetch'
                ? 'Cannot reach the server. Make sure the backend is running (e.g. npm run dev in the backend folder).'
                : error.message;
            return { success: false, message };
        }
    };

    const login = async (email, password, requiredRole = null) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed');

            if (requiredRole && data.user.role !== requiredRole) {
                return { success: false, message: `Access denied. This portal is for ${requiredRole}s only.` };
            }

            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            return { success: true, user: data.user };
        } catch (error) {
            const message = error.message === 'Failed to fetch'
                ? 'Cannot reach the server. Make sure the backend is running (e.g. npm run dev in the backend folder).'
                : error.message;
            return { success: false, message };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setUsers([]);
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, token, users, loading, signup, login, logout, fetchUsers }}>
            {children}
        </AuthContext.Provider>
    );
};
