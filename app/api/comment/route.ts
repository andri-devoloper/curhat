import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const curhatId = parseInt(searchParams.get("curhatId") || "");

    if (!curhatId) {
      return NextResponse.json(
        { error: "curhatId is required" },
        { status: 400 }
      );
    }

    const curhat = await prisma.curhat.findUnique({
      where: { id: curhatId },
    });

    if (!curhat) {
      return NextResponse.json(
        { error: "Curhat post not found" },
        { status: 404 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { curhatId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { curhatId, content } = await request.json();

    if (!curhatId || !content) {
      return NextResponse.json(
        { error: "curhatId and content are required" },
        { status: 400 }
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        curhatId,
        content,
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
