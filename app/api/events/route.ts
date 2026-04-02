import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.isAdmin !== true) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const {
      title,
      slug,
      description,
      location,
      eventDate,
      endDate,
      coverImage,
      maxParticipants,
      registrationDeadline,
      published,
    } = await request.json();

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        location,
        eventDate: new Date(eventDate),
        endDate: endDate ? new Date(endDate) : null,
        coverImage,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        registrationDeadline: registrationDeadline
          ? new Date(registrationDeadline)
          : null,
        organizerId: session.user.id,
        published,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
