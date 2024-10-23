import { NextResponse } from 'next/server';
import { authAdmin } from "@/app/firebase/firebaseAdmin";

export async function POST(request: Request) {
  const { uid, newPassword } = await request.json(); // Extract UID and new password from the request body

  try {
    await authAdmin.updateUser(uid, { password: newPassword }); // Update the user's password
    return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ error: 'Error changing password' }, { status: 500 });
  }
}
