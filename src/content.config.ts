import { defineCollection, z } from 'astro:content';
import { notionLoader } from './loaders/notion/loader';

export const types: readonly [string, ...string[]] = [
  'art',
  'writing',
  'talks',
  'podcasts',
  'acting',
];
export const topics: readonly [string, ...string[]] = [
  'nature',
  'design',
  'research',
  'mind',
  'fiction',
];

const today = new Date();
today.setHours(0, 0, 0, 0);

const notionBlog = defineCollection({
  loader: notionLoader({
    integration_token: import.meta.env.NOTION_TOKEN,
    data_source_id: import.meta.env.NOTION_DATABASE_ID,
    // Use Notion sorting and filtering
    filter: {
      and: [
        {
          property: 'Status',
          select: {
            equals: 'Published',
          },
        },
        {
          property: 'Publish date',
          date: {
            on_or_before: today.toISOString(),
          },
        },
      ],
    },
    sorts: [
      {
        property: 'Publish date',
        direction: 'ascending',
      },
    ],
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    author: z.string(),
    publishedAt: z.date(),
    type: z.enum(types).optional().default('art'),
    topics: z.array(z.enum(topics)).optional().default([]),
    image: z
      .object({
        src: z.string().url(),
        alt: z.string().nullable().optional(),
        caption: z.string().nullable().optional(),
      })
      .optional(),
    description: z.string().optional(),
  }),
});

export const collections = { notionBlog };
