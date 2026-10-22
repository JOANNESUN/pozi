import express from 'express';
import cors from 'cors';
import { feedbackSchema } from './feedbackSchema.js';

const app = express();
const PORT = 3000;


const feedback = [];

app.use(cors());
app.use(express.json());

app.post('/api/feedback', (req, res) => {
  const result = feedbackSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: 'Invalid feedback' });
  }

  const newFeedback = {
    id: crypto.randomUUID(),
    ...result.data,
    created_at: new Date().toISOString(),
  };

  feedback.push(newFeedback);
  res.status(201).json(newFeedback);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
