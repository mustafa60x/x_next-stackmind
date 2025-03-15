// api/auth
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log(request);
  return NextResponse.json({ message: "Hello from auth endpoint" });
}

export async function POST(request: Request) {
  console.log(request);
  return NextResponse.json({ message: "Hello from auth endpoint" });
}

export async function PUT(request: Request) {
  console.log(request);
  return NextResponse.json({ message: "Hello from auth endpoint" });
}
