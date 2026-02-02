import { type Config } from '@netlify/functions';

export default async () => {
  await fetch('https://api.netlify.com/build_hooks/697feb2ad71e7d1015256fca', {
    method: 'POST',
  });
};

export const config: Config = {
  schedule: '@daily',
};
