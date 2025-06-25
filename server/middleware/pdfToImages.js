import { promises as fs } from 'fs';
import path from 'path';
import { pdf } from 'pdf-to-img';

export async function renderPdfToImages(pdfPath, bookId) {
  const outputDir = path.join(process.cwd(), 'book_pages', String(bookId));
  await fs.mkdir(outputDir, { recursive: true });

  const document = await pdf(pdfPath, { scale: 2 });

  let counter = 1;
  for await (const image of document) {
    const imagePath = path.join(outputDir, `page${counter}.png`);
    await fs.writeFile(imagePath, image);
    console.log(`✅ page${counter}.png saved`);
    counter++;
  }

  console.log(`📘 סה"כ ${counter - 1} עמודים נשמרו`);
}
