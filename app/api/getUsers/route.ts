import { NextResponse } from 'next/server';
import { authAdmin } from "@/app/firebase/firebaseAdmin";

export async function GET() {
  try {
    const users = await authAdmin.listUsers(); // Fetch the list of users
    return NextResponse.json(users.users); // Send the user list to the client
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
  }
}
