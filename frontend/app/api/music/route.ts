import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const musicDir = path.join(process.cwd(), 'public', 'music');
  const songsJsonPath = path.join(musicDir, 'songs.json');

  try {
    const content = await fs.readFile(songsJsonPath, 'utf8');
    const parsed = JSON.parse(content);
    const songs = Array.isArray(parsed)
      ? parsed.map((s) => ({
          name: s.name ?? '',
          singer: s.singer ?? '',
          lang: s.lang ?? '',
          url: s.url ?? ''
        }))
      : [];

    return NextResponse.json({ songs });
  } catch {
    return NextResponse.json({ songs: [] });
  }
}
