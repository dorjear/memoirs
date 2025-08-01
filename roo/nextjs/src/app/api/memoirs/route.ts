import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

interface Memoir {
  id: number;
  title: string;
  date: string;
  content: string;
  tags: string[];
  photo: string | null;
}

// In-memory memoir data (for demonstration purposes)
let memoirs: Memoir[] = [
  {
    id: 1,
    title: "My First Memory",
    date: "2023-01-01",
    content: "This is the content of my first memory.",
    tags: ["childhood", "family"],
    photo: null
  },
  {
    id: 2,
    title: "A Day at the Beach",
    date: "2023-02-15",
    content: "Sunny skies and sandy toes.",
    tags: ["vacation", "beach"],
    photo: null
  }
];

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function GET() {
  return NextResponse.json(memoirs);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const date = formData.get('date') as string;
  const content = formData.get('content') as string;
  const tags = formData.get('tags') as string;
  const photo = formData.get('photo') as File | null;

  let tagsArr: string[] = [];
  try {
    tagsArr = tags ? JSON.parse(tags) : [];
  } catch {
    tagsArr = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  }

  let photoPath: string | null = null;
  if (photo) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(photo.name);
    const filePath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filePath, Buffer.from(await photo.arrayBuffer()));
    photoPath = `/uploads/${filename}`;
  }

  const newMemoir = {
    id: memoirs.length ? Math.max(...memoirs.map(m => m.id)) + 1 : 1,
    title,
    date,
    content,
    tags: tagsArr,
    photo: photoPath
  };
  memoirs.push(newMemoir);
  return NextResponse.json(newMemoir, { status: 201 });
}