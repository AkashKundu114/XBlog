import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req) {
  const secret = req.headers.get('x-revalidation-secret');
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ success: false, message: 'Invalid secret' }, { status: 401 });
  }
  const { slug } = await req.json();
  if (slug) revalidatePath(`/blog/${slug}`);
  revalidatePath('/blog');
  revalidatePath('/');
  return NextResponse.json({ success: true, revalidated: true });
}
