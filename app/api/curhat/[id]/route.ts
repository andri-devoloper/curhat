import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.comment.deleteMany({
      where: { curhatId: id },
    });
    await prisma.curhat.delete({
      where: { id },
    });

    const existingCurhat = await prisma.curhat.findUnique({
      where: { id },
      include: { comments: true },
    });

    console.log("Curhat to delete:", existingCurhat);

    if (!existingCurhat) {
      return NextResponse.json({ error: "Curhat not found" }, { status: 404 });
    }

    await prisma.curhat.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Curhat and related comments deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting curhat:", error); // Log error di sini
    return NextResponse.json(
      { error: "Failed to delete curhat and related comments" },
      { status: 500 }
    );
  }
}
