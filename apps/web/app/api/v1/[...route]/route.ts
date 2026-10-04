import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const { route } = await params;
  return NextResponse.json({
    message: "Stoker API v1",
    path: route.join("/"),
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const { route } = await params;
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    status: "received",
    path: route.join("/"),
    body,
  });
}
