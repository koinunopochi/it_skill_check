import express from 'express';
import { YamlExamRepository } from './infrastructure/YamlExamRepository';
import { ExamService } from './application/ExamService';
import { ExamController } from './presentation/ExamController';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use((req,res,next)=>{
  console.log(`Request received at ${new Date().toLocaleString()}`)
  console.log(`Route: ${req.url}`)
  console.log(`Method: ${req.method}`)
  next()
})

const examRepository = new YamlExamRepository();
const examService = new ExamService(examRepository);
const examController = new ExamController(examService);

app.get('/api/exam', (req, res) => examController.getExam(req, res));
app.get('/api/exam/meta/list', (req, res) => examController.getYamlMetaList(req, res));
app.post('/api/exam', (req, res) => examController.createExam(req, res));
app.put('/api/exam', (req, res) => examController.updateExam(req, res));
app.delete('/api/exam', (req, res) => examController.deleteExam(req, res));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
