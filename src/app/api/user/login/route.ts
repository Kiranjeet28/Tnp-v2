// app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// POST: Login or Register
export async function POST(req: NextRequest) {
    try {
        const { email, password, name } = await req.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            // USER EXISTS - LOGIN
            const isValidPassword = await bcrypt.compare(password, existingUser.password);

            if (!isValidPassword) {
                return NextResponse.json(
                    { error: 'Invalid password' },
                    { status: 401 }
                );
            }

            // Generate token
            const token = jwt.sign(
                {
                    userId: existingUser.id,
                    email: existingUser.email,
                    role: existingUser.role
                },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            return NextResponse.json({
                message: 'Login successful',
                token,
                user: {
                    id: existingUser.id,
                    email: existingUser.email,
                    name: existingUser.name,
                    role: existingUser.role
                },
                isNewUser: false
            });
        } else {
            // USER DOESN'T EXIST - CREATE NEW USER
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: name || null,
                    role: 'USER'
                }
            });

            // Generate token
            const token = jwt.sign(
                {
                    userId: newUser.id,
                    email: newUser.email,
                    role: newUser.role
                },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            return NextResponse.json({
                message: 'Account created successfully',
                token,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                    role: newUser.role
                },
                isNewUser: true
            }, { status: 201 });
        }
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET: Get current user
export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return NextResponse.json(
                { error: 'Access token required' },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
            email: string;
            role: string;
        };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 403 }
        );
    }
}