import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskProgressionService } from '../shared/task-progression.service';

@Component({
  selector: 'app-task-watch-video',
  templateUrl: './task-watch-video.component.html',
  styleUrls: ['./task-watch-video.component.scss']
})
export class TaskWatchVideoComponent implements OnInit {
  simulationId = '';
  videoWatched = false;
  taskComplete = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskProgressionService
  ) {}

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      this.simulationId = params['id'] || '';
    });
  }

  markVideoWatched(): void {
    this.videoWatched = true;
    this.taskComplete = true;
  }

  openNextTask(): void {
    this.taskService.completeTask('hotfix');
    this.router.navigate(['../submit-form'], { relativeTo: this.route });
  }
}
