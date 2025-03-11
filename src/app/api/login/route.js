import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set.');
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid input',
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Replace with your actual user authentication logic
    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateJwtToken(user);

    // Securely set the JWT token in a cookie.
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: { id: user.id, email: user.email, name: user.name },
      },
      { status: 200 }
    );

    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60, // 1 hour (adjust as needed)
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function authenticateUser(email: string, password: string) {
  // Replace with your actual database authentication logic
  if (email === 'test@example.com' && password === 'password123') {
    return { id: 1, email, name: 'Test User' };
  }
  return null;
}

function generateJwtToken(user: { id: number; email: string; name: string }) {
  const payload = {
    userId: user.id,
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}