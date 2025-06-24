import express from 'express';
import path from 'path';

const app = express();

app.use('/book-Pages', express.static(path.join(process.cwd(), 'book-Pages')));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
