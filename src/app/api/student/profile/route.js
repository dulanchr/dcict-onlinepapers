import { NextResponse } from 'next/server';
import { getCurrentUser, isStudent } from '../../../../lib/session';

export async function GET() {
    try {
        // Middleware already checks authentication, but double-check role
        if (!await isStudent()) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const user = await getCurrentUser();

        // Return safe user data
        return NextResponse.json({
            profile: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
