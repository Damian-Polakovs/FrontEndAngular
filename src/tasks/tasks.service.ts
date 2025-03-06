import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async getStudentDetails(studentId: string) {
    const student = await this.taskModel.findOne({ student_id: studentId }).exec();
    return {
      id: student.student_id,
      name: student.student_name,
    };
  }

  async getStudentAttendance(studentId: string) {
    return this.taskModel
      .find({ student_id: studentId })
      .sort({ date: -1 })
      .exec();
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel(createTaskDto);
    return createdTask.save();
  }

  async createBulk(createTaskDtos: CreateTaskDto[]): Promise<Task[]> {
    return this.taskModel.insertMany(createTaskDtos);
  }
}