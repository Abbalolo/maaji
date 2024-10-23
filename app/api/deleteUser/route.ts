import { NextResponse } from 'next/server';
import { authAdmin } from "@/app/firebase/firebaseAdmin";

export async function DELETE(request: Request) {
  const { uid } = await request.json(); // Extract UID from the request body

  try {
    await authAdmin.deleteUser(uid); // Delete the user by UID
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
  }
}
