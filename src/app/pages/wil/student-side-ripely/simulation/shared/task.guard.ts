import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TaskProgressionService, TaskKey } from './task-progression.service';

@Injectable()
export class TaskGuard implements CanActivate {
  constructor(
    private taskService: TaskProgressionService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const taskKey = route.data['taskKey'] as TaskKey | undefined;
    if (!taskKey) return true;

    if (this.taskService.isTaskUnlocked(taskKey)) {
      return true;
    }

    // Redirect to intro if task is locked
    const simId = route.parent?.paramMap.get('id') || '';
    this.router.navigateByUrl(`/student-portal/simulations/${simId}/intro`);
    return false;
  }
}
