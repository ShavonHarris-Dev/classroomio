export type Categories = 'sveltekit' | 'svelte';

export type Post = {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  author: string;
  role: string;
  avatar: string;
  date: string;
  categories: Categories[];
  published: boolean;
};
