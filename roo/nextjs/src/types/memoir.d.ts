interface Memoir {
  id: number;
  title: string;
  date: string;
  content: string;
  tags: string[];
  photo: string | File | null;
}