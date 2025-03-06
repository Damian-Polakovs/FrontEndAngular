import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  getStudentDetails(@Param('id') id: string) {
    return this.tasksService.getStudentDetails(id);
  }

  @Get('attendance/:id')
  getStudentAttendance(@Param('id') id: string) {
    return this.tasksService.getStudentAttendance(id);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Post('bulk')
  createBulk(@Body() createTaskDtos: CreateTaskDto[]) {
    return this.tasksService.createBulk(createTaskDtos);
  }
}