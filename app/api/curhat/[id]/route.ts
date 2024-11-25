import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const curhatId = parseInt(params.id); // Ambil dari parameter route

    if (isNaN(curhatId)) {
      return NextResponse.json(
        { error: "ID must be a valid number" },
        { status: 400 }
      );
    }

    // Hapus komentar terkait curhat
    await prisma.comment.deleteMany({
      where: { curhatId },
    });

    // Periksa apakah curhat ada
    const existingCurhat = await prisma.curhat.findUnique({
      where: { id: curhatId },
    });

    if (!existingCurhat) {
      return NextResponse.json({ error: "Curhat not found" }, { status: 404 });
    }

    // Hapus curhat
    await prisma.curhat.delete({
      where: { id: curhatId },
    });

    return NextResponse.json(
      { message: "Curhat and related comments deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting curhat:", error); // Log error untuk debugging
    return NextResponse.json(
      { error: "Failed to delete curhat and related comments" },
      { status: 500 }
    );
  }
}
