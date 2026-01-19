import express from 'express';
import helloRouter from './routes/hello.js'; // your file path

const app = express();

app.use('/api', helloRouter); // now route is /api/hello

app.listen(5000, () => console.log('Server running on port 5000'));
