import { hash } from "bcryptjs";
import { db } from "~/server/db";

  interface userPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }
export async function POST(req: Request) {

  try {
    const body = await req.json() as userPayload;
    
    // Use type assertion here
    const { email, password, firstName, lastName } = body ;
    const hashedPassword = await hash(password, 12);

    const user = await db.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
    });

    return new Response(JSON.stringify(user), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error creating user" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}