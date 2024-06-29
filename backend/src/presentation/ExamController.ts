import { Request, Response } from 'express';
import { ExamService } from '../application/ExamService';

export class ExamController {
  constructor(private examService: ExamService) {}

  async getExam(req: Request, res: Response): Promise<void> {
    try {
      console.log('Full request URL:', req.url);
      const id = req.query.id as string;
      const format = req.query.format as string;
      console.log(format);
      const exam = await this.examService.getExam(id, format);
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

  async getYamlMetaList(req: Request, res: Response): Promise<void> {
    try {
      const yamlIdList = await this.examService.getYamlMetaList();
      console.log(yamlIdList);
      res.json(yamlIdList);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async createExam(req: Request, res: Response): Promise<void> {
    try {
      const filename = req.body.name as string;
      const content = req.body.content as string;
      await this.examService.createExam(filename, content);
      res.json({ message: 'Created' });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async updateExam(req: Request, res: Response): Promise<void> {
    try {
      const id = req.query.id as string;
      const filename = req.body.name as string;
      const content = req.body.content as string;
      await this.examService.updateExam(id, filename, content);
      res.json({ message: 'Updated' });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deleteExam(req: Request, res: Response): Promise<void> {
    try {
      const id = req.query.id as string;
      await this.examService.deleteExam(id);
      res.json({ message: 'Deleted' });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
