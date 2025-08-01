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

// In-memory memoir data (for demonstration purposes) - This should be consistent with route.ts
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

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const memoir = memoirs.find(m => m.id === parseInt(params.id));
  if (!memoir) {
    return NextResponse.json({ error: 'Memoir not found' }, { status: 404 });
  }
  return NextResponse.json(memoir);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

  const memoirIndex = memoirs.findIndex(m => m.id === parseInt(params.id));
  if (memoirIndex === -1) {
    return NextResponse.json({ error: 'Memoir not found' }, { status: 404 });
  }

  let photoPath: string | null = memoirs[memoirIndex].photo;
  if (photo) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(photo.name);
    const filePath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filePath, Buffer.from(await photo.arrayBuffer()));
    photoPath = `/uploads/${filename}`;
  }

  const updatedMemoir = {
    ...memoirs[memoirIndex],
    title,
    date,
    content,
    tags: tagsArr,
    photo: photoPath
  };

  memoirs[memoirIndex] = updatedMemoir;
  return NextResponse.json(updatedMemoir);
}