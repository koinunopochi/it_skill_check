import express from 'express';
import { YamlExamRepository } from './infrastructure/YamlExamRepository';
import { ExamService } from './application/ExamService';
import { ExamController } from './presentation/ExamController';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

const examRepository = new YamlExamRepository();
const examService = new ExamService(examRepository);
const examController = new ExamController(examService);

app.get('/api/exam', (req, res) => examController.getExam(req, res));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
