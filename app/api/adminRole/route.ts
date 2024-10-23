import { NextResponse } from 'next/server';
import { authAdmin } from '@/app/firebase/firebaseAdmin'; 

// Export a named handler for the POST method
export async function POST(request: Request) {
  try {
    // Parse the request body
    const { uid } = await request.json();

    // Set custom claims for the user
    await authAdmin.setCustomUserClaims(uid, { admin: true });

    return NextResponse.json({ message: 'Admin role assigned successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error assigning admin role:", error);
    return NextResponse.json({ error: 'Error assigning admin role' }, { status: 500 });
  }
}
