import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(params);
    const { data: post, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        user:users (
          username,
          id
        ),
        comments (
          *,
          user:users (
            username,
            id
          )
        )
      `
      )
      .eq("id", Number(id))
      .single();

    if (error) {
      return NextResponse.json({ message: "Post bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}
