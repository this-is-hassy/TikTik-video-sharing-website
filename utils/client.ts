import   createCient, { createClient }  from '@sanity/client';

export const client = createClient({
  projectId: '1b4b5cir',
  dataset: 'production',
  apiVersion: '2022-03-10',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});
