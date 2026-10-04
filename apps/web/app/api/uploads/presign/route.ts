import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const _body = await request.json().catch(() => ({}));
  return NextResponse.json({
    uploadUrl: "http://localhost:9000/stoker/uploads/mock-object-key",
    objectKey: "mock-object-key",
    expiresInSeconds: 900,
  });
}
