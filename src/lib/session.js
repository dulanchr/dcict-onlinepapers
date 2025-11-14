import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export const sessionOptions = {
    password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_change_this_in_production',
    cookieName: 'dcict_session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    },
};

export async function getSession() {
    try {
        const cookieStore = await cookies();
        const session = await getIronSession(cookieStore, sessionOptions);
        return session;
    } catch (error) {
        console.error('Session error:', error);
        throw error;
    }
}

export async function isAuthenticated() {
    try {
        const session = await getSession();
        return !!session.user;
    } catch (error) {
        return false;
    }
}

export async function isStudent() {
    try {
        const session = await getSession();
        return session.user?.role === 'student';
    } catch (error) {
        return false;
    }
}

export async function isTeacher() {
    try {
        const session = await getSession();
        return session.user?.role === 'teacher';
    } catch (error) {
        return false;
    }
}

export async function getCurrentUser() {
    try {
        const session = await getSession();
        return session.user || null;
    } catch (error) {
        return null;
    }
}
