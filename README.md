This is a Next.js app that allows you to combine csv files.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to use

1. Upload a file to determine the structure of the final csv file.
2. Upload the files you want to combine. If a file has a different structure from the first file, the app will show a warning message. Columns not present in the first file will be omitted.
