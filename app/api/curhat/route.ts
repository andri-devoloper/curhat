import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    const curhats = await prisma.curhat.findMany({
      include: { comments: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(curhats, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch curhats" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const newCurhat = await prisma.curhat.create({
      data: { content },
    });

    return NextResponse.json(newCurhat, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create new curhat" },
      { status: 500 }
    );
  }
}
