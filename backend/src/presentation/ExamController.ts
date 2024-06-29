import { Request, Response } from 'express';
import { ExamService } from '../application/ExamService';

export class ExamController {
  constructor(private examService: ExamService) {}

  async getExam(req: Request, res: Response): Promise<void> {
    try {
      const filename = req.query.filename as string;
      console.log(filename);
      const exam = await this.examService.getExam(filename);
      res.json(exam);
    } catch (error: any) {
      if (error.errno === -4058) {
        res.status(404).json({ error: 'File not found' });
        return;
      }
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
