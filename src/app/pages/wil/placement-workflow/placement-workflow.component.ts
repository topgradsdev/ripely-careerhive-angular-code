import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { Utils } from '../../../shared/utility';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxPermissionsService } from 'ngx-permissions';
import Quill from 'quill';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DndDropEvent } from 'ngx-drag-drop';

@Component({
  selector: 'app-placement-workflow',
  templateUrl: './placement-workflow.component.html',
  styleUrls: ['./placement-workflow.component.scss']
})
export class PlacementWorkflowComponent implements OnInit {
  placementId: any;
  modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
        ['link']  ,
        ['custom-button']  // Custom button added to toolbar
      ],
      handlers: {
        'custom-button': () => this.insertCustomElement()  // Custom button click handler
      }
    }
    // toolbar: [
    //   ['bold', 'italic', 'underline', 'strike'],        
    //   [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    //   [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
    //   ['link']  ,
    //   ['placeholder']   
    // ]
  };
  placementType:any = {
      items:[]
  };

  // Doc. Library
  docLibraryFolders: any[] = [];
  renameFolderName: string = '';
  renameFolderIndex: number = -1;
  deleteFolderIndex: number = -1;
  deleteFileFolder: number = -1;
  deleteFileIndex: number = -1;
  deleteFileName: string = '';

  editorConfig = {
    height: 200,
    menubar: false,
    statusbar: true,
    placeholder: 'Email content',
    plugins: 'linkchecker wordcount table  autosave advlist anchor image link lists media searchreplace visualblocks template',
    toolbar: 'undo redo | bold italic underline | align bullist numlist | blocks | image | placeHolderToken',
    contextmenu: false,
    setup: function (editor) {
      editor.ui.registry.addMenuButton('placeHolderToken', {
        text: '{{...}}',
        fetch: (callback) => {
          const items = [
            {
              type: 'nestedmenuitem',
              text: 'Student',
              getSubmenuItems: () => [
                {
                  type: 'menuitem',
                  text: 'Name',
                  onAction: (_) => editor.insertContent("[[name]]")
                },
                {
                  type: 'menuitem',
                  text: 'Email',
                  onAction: (_) => editor.insertContent("[[email]]")
                },
                {
                  type: 'menuitem',
                  text: 'Password',
                  onAction: (_) => editor.insertContent("[[password]]")
                },
                {
                  type: 'menuitem',
                  text: 'First Name',
                  onAction: (_) => editor.insertContent("[[first_name]]")
                },
                {
                  type: 'menuitem',
                  text: 'Last Name',
                  onAction: (_) => editor.insertContent("[[last_name]]")
                }
              ]
            }
          ];
          callback(items);
        }
      });
    }
  }
  createPlacementType: FormGroup;
  renamePlacementType: FormGroup;
  emailReminder: FormGroup;
  rearrange_task: boolean;
  emptyTaskStep: boolean;
  dragging: boolean = false;
  placementTypes = [];
  allPlacementTypes = [];
  taskOfPlacementType = [];
  taskList = [];
  stepsType = [];
  allPlacementTitle = [];
  selectedTask: any = {}
  workFlowTask = [];
  stepForDelete: any;
  selectedPlacementType: any;
  placementGroupDetails :any = {};
  stage: string = 'Pre-Placement';
  selectedWorkflowType = {
    _id: null,
    type: null,
    workflow_type_id: null,
    self_source: null,
    workflow_code:null,
    description: null,
    placement_id: null,
    student_count: null
  };
  disabledTrackProgress: boolean = false;
  selectedTabIndex: number = 0;
  placementGroupDetail: any;
  categories = [];
  emailTemplateList = [];
  selectedTemplate = null;
  selectedPlacementTypeFromAllPlacement: any = {};
  canAddPlacementType: boolean = true;
  @ViewChild('closeCreatePlacementModal') closeCreatePlacementModal;
  @ViewChild('renamePlacementModal') renamePlacementModal;
  @ViewChild('closeSendEmailModal') closeSendEmailModal;
  @Input() updatedPlacementDetail: any;
  isWILWritePermission = false;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: TopgradserviceService,
    private sanitizer: DomSanitizer,
    private ngxPermissionService: NgxPermissionsService, private cdr: ChangeDetectorRef
  ) { }

   formWorkflow(){
      this.createPlacementType = new FormGroup({
      placementType: new FormControl('', [Validators.required]),
      workflow_code: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.nullValidator]),
      self_source: new FormControl(false, [Validators.nullValidator]),
    })
  }

  ngOnInit(): void {
    console.log("this.updatedPlacementDetail", this.updatedPlacementDetail);

   
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.placementId = params.get('id');
    });
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      this.stage = params['params']['stage'] ? params['params']['stage'] : 'Pre-Placement';
      this.selectedTabIndex = 0;
      if (this.stage === 'Pre-Placement') {
        this.selectedTabIndex = 0
      } else if (this.stage === 'Ongoing') {
        this.selectedTabIndex = 1;
      } else if (this.stage === 'Post-Placement') {
        this.selectedTabIndex = 2;
      }
    })
    this.formWorkflow();
    this.renamePlacementType = new FormGroup({
      placementType: new FormControl('', [Validators.required]),
      workflow_code: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.nullValidator]),
      self_source: new FormControl(false, [Validators.nullValidator]),
    })
    this.emailReminder = new FormGroup({
      category_id: new FormControl('', [Validators.required]),
      template_id: new FormControl('', [Validators.required]),
      subject: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]),
    });
    this.getEmailCategories();
    this.getPlacementGroupDetails();
    this.getAllTask();
    this.getPlacementTypes();
    this.getAllWorkflowTypes();
    this.loadDocFolders();
    this.service.placementGroupDetails.subscribe((data) => {
      this.placementGroupDetails = data;
    })
  }

  getPlacementGroupDetails() {
    let payload = { id: this.placementId };
    this.service.getPlacementGroupDetails(payload).subscribe((response: any) => {
      this.placementGroupDetails = response.result;
      console.log(
        " this.placementGroupDetails",  this.placementGroupDetails
      )
    });
  }

  getAllTask() {
    let payload = { placement_id: this.placementId }
    this.service.getAllTask(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.taskList = response.result;
        this.stepsType = this.taskList.map(task => task.name);
      } else {
        this.taskList = [];
      }
    })
  }

 async showOnly(data){
    if(data.type){
      // let find = this.placementGroupDetails?.placement_type?.find(e=>e.toLowerCase() == data.type.toLowerCase());
      // if(find){
      //   return true;
      // }else{
      //   return false;
      // }
      return false;
    }else{
      return false;
    }
  }

  getPlacementTypes() {
    let payload = { placement_id: this.placementId }
    this.service.getPlacementTypes(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.placementTypes = response.result.map((placementType, index) => {
          placementType['selected'] = false;
          placementType['publish_at'] = Utils.convertDate(Number(placementType?.publish_at), 'DD/MM/YY')
          if (!this.selectedWorkflowType?.workflow_type_id && index === 0) {
            placementType['selected'] = true;
            this.selectedWorkflowType = placementType;
            this.getWorkflowTask(this.stage, placementType);
          } else if (this.selectedWorkflowType?.workflow_type_id === placementType.workflow_type_id) {
            placementType['selected'] = true;
            this.selectedWorkflowType = placementType;
            this.getWorkflowTask(this.stage, placementType);
          }
          return placementType;
        });
        this.canAddPlacementType = true;
        if (this.placementTypes.length >= 8) {
          this.canAddPlacementType = false;
        }
      } else {
        this.placementTypes =  [];
        this.disabledTrackProgress = true;
      }
    })
  }

  searchKey:any = ''
  searchKeys = ['type', 'placement_group_title'];
  // applyFilter(filterValue) {

  //   this.searchKey = filterValue.target.value
  //   console.log("search", this.searchKey);


  //   this.filteredPlacementTypes = this.allPlacementTypes.filter(item => {
  //     return this.searchKeys.some(key => {
  //       return item[key]?.toString().toLowerCase().includes(this.searchKey.toLowerCase());
  //     });
  //   });

  //   // console.log("after searchhhhh-00------------0=====", this.event);

  //   // if (this.event) {
  //   //   console.log("after searchhhhh=====", this.event);

  //   //   this.paginationOptionChange(this.event)
  //   // }
  //   // else {
  //   //   this.articleList()

  //   // }

  // }
  filteredPlacementTypes:any = [];
  copyPlacementTypes(){
    this.filteredPlacementTypes = this.allPlacementTypes;
    console.log("this.allPlacementTypes", this.allPlacementTypes);
  }


  getAllWorkflowTypes() {
  this.service.getAllWorkflowTypes({ placement_id: this.placementId }).subscribe((response: any) => {
    if (response.status == HttpResponseCode.SUCCESS) {
      console.log("responseresponse", response);

      // Clear previous titles
      this.allPlacementTitle = [];

      // Map data without pushing in loop
      this.allPlacementTypes = response.result.map(allPlacementType => ({
        ...allPlacementType,
        selected: false,
        publish_at: Utils.convertDate(Number(allPlacementType?.publish_at), 'DD/MM/YY')
      }));

      // Create allPlacementTitle array separately
      this.allPlacementTitle = this.allPlacementTypes.map(p => p.placement_group_title);
      this.loadMore();
      // Use slice to create a proper copy for filteredPlacementTypes
      // this.filteredPlacementTypes = [...this.allPlacementTypes];

      // console.log("Filtered Placement Types", this.filteredPlacementTypes);
    }
  });
}

resetList() {
  this.displayedPlacementTypes = this.allPlacementTypes.slice(0, this.pageSize);
  this.currentPage = 1;
}

trackByPlacementType(index: number, item: any): any {
  return item._id || item.placement_group_title || index;  // Use a unique ID if available
}

 applyFilter(event: any) {
    const searchTerm = event.target.value.toLowerCase();

    const filtered = this.allPlacementTypes.filter(item =>
      item.placement_group_title?.toLowerCase().includes(searchTerm) ||
      item.type?.toLowerCase().includes(searchTerm)
    );

    this.displayedPlacementTypes = filtered.slice(0, this.pageSize); // First page
    this.currentPage = 1; // Reset pagination
    // User will scroll to load more from filtered data
  }



pageSize = 20;
currentPage = 0;
isLoadingMore = false;
displayedPlacementTypes: any[] = [];
loadMore() {
    if (this.isLoadingMore) return;

    this.isLoadingMore = true;

    // Calculate next chunk
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    const nextItems = this.allPlacementTypes.slice(start, end);

    if (nextItems.length > 0) {
      this.displayedPlacementTypes = [...this.displayedPlacementTypes, ...nextItems];
      this.currentPage++;
    }

    this.isLoadingMore = false;
    this.cdr.markForCheck(); // If using OnPush
  }

  // getAllWorkflowTypes() {
    
  //   this.service.getAllWorkflowTypes({'placement_id':this.placementId}).subscribe((response: any) => {
  //     if (response.status == HttpResponseCode.SUCCESS) {
  //       console.log("responseresponse", response);
  //       this.allPlacementTypes = response.result.map((allPlacementType, index) => {

  //         this.allPlacementTitle.push(allPlacementType?.placement_group_title);
  //         allPlacementType['selected'] = false;
  //         allPlacementType['publish_at'] = Utils.convertDate(Number(allPlacementType?.publish_at), 'DD/MM/YY');
  //         return allPlacementType;
  //       });

  //       this.copyPlacementTypes();
  //     }
  //   })
  // }

  onSlectedTask(task) {
    this.selectedTask = task;
  }

  duplicateTask() {
    let payload = {
      task_id: this.selectedTask._id
    }
    this.service.duplicateTask(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.getAllTask();
      }
    })
  }

  deleteTask() {
    let payload = {
      task_id: this.selectedTask._id
    }

    this.service.deleteTask(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.getAllTask();
      }
    })
  }

  deleteTaskFromStep() {
    let payload = {
      task_id: this.selectedTask._id
    }

    this.service.deleteTask(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.getWorkflowTask(this.stage, { workflow_type_id: this.selectedTask.workflow_type_id });
      }
    })
  }

  rearrange() {
    this.rearrange_task = !this.rearrange_task;
  }

  /* onSelectPlacementType(type) {
    this.placementTypes.forEach((placementType)=> {
      placementType.selected = false;
      if(placementType.type === type){
        placementType.selected = true;
        this.selectedWorkflowType = placementType;
        this.getWorkflowTask(this.stage, placementType);
      }
    })
  } */

  onSelectPlacementType(placementType) {
    this.placementTypes = this.placementTypes.map((placementType) => {
      placementType['selected'] = false;
      return placementType;
    })
    placementType.selected = true;
    this.selectedWorkflowType = placementType;
    this.getWorkflowTask(this.stage, placementType);
  }

  onAddNewPlacementType(data) {
    if (this.createPlacementType.valid) {
      let newPlacementType = {
        placement_id: this.placementId,
        type: this.createPlacementType.value.placementType,
        workflow_code: this.createPlacementType.value.workflow_code,
        description: this.createPlacementType.value.description,
        self_source: this.createPlacementType.value.self_source,
        selected: false
      }
      this.placementTypes.push(newPlacementType);
      delete newPlacementType.selected;
      this.service.addPlacementType(newPlacementType).subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
          this.service.showMessage({ message: response.msg });
          this.createPlacementType.reset();
          this.closeCreatePlacementModal.ripple.trigger.click();
          this.getPlacementTypes();
        }
      });
    }else{
       this.createPlacementType.markAllAsTouched();   
    }
  }

  setetPlacementTypeOnEditWindow() {
    console.log("this.selectedWorkflowType", this.selectedWorkflowType)
    this.renamePlacementType.patchValue({
      placementType: this.selectedWorkflowType.type,
      self_source: this.selectedWorkflowType.self_source,
      workflow_code: this.selectedWorkflowType?.workflow_code,
      description: this.selectedWorkflowType?.description,
    })
  }

  onRenamePlacementType() {
    if (this.renamePlacementType.valid) {
      let renamePlacementType = {
        placement_id: this.placementId,
        type_id: this.selectedWorkflowType.workflow_type_id,
        workflow_code: this.renamePlacementType.value.workflow_code,
        description: this.renamePlacementType.value.description,
        type: this.renamePlacementType.value.placementType,
        self_source: this.renamePlacementType.value.self_source,
      }

      this.service.renamePlacementType(renamePlacementType).subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
          this.service.showMessage({ message: response.msg });
          this.renamePlacementModal.ripple.trigger.click();
          this.renamePlacementType.reset();
          this.getPlacementTypes();
        }
      })
    }
  }

  onSelectPlacementProgress(event) {
    this.workFlowTask = [];
    let workflowType = this.placementTypes.find(placementType => placementType.selected);
    console.log("workflowType", workflowType)
    this.selectedWorkflowType = workflowType;
    this.stage = event.tab.textLabel;
    this.getWorkflowTask(this.stage, workflowType);
  }

  getWorkflowTask(stage, workflowType) {
    console.log("stage, workflowType", stage, workflowType);
    let payload = {
      placement_id: this.placementId,
      stage: stage,
      workflow_type_id: workflowType.workflow_type_id
    }
    this.service.getWorkflowTask(payload).subscribe((response: any) => {
      this.workFlowTask = [];
      if (response.status == HttpResponseCode.SUCCESS) {
        this.disabledTrackProgress = false;
        this.workFlowTask = response.result;

        console.log("this.workFlowTask", this.workFlowTask)
      } else {
        this.disabledTrackProgress = true;
        this.workFlowTask = [];
      }
    });
  }

  selectedPTabIndex: number = 0;

  onSelectPlacementProgressOfAllPlacementTypes(event, placementType) {
    this.taskOfPlacementType = [];
    this.getWorkflowTaskOfPlacementType(event.tab.textLabel, placementType);
  }

  getWorkflowTaskOfPlacementType(stage, placementType) {

    console.log("stage, placementType", stage, placementType);
    this.selectedPlacementTypeFromAllPlacement = placementType;
    let payload = {
      placement_id: placementType.placement_id,
      stage: stage,
      workflow_type_id: placementType._id
    }
    this.service.getWorkflowTask(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.taskOfPlacementType = response.result;
        console.log('TT=>', response);

      }
    });
  }

  addStep() {
    let workflowType = this.placementTypes.find(placementType => placementType.selected);
    this.selectedWorkflowType = workflowType;
    let addNewStep = {
      placement_id: this.placementId,
      workflow_type_id: workflowType.workflow_type_id,
      stage: this.stage,
      title: 'Step',
      get_tasks: []
    }
    this.service.addNewStep(addNewStep).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        addNewStep['_id'] = response?.step_id;
        this.workFlowTask.push(addNewStep);
      }
    })
  }

  selectStepForDelete(step) {
    this.stepForDelete = step;
  }

  deleteStep() {
    let payload = {
      placement_id: this.placementId,
      step_id: this.stepForDelete?._id
    }
    this.service.deleteWorkflowStep(payload).subscribe((response) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.getWorkflowTask(this.stepForDelete.stage, { workflow_type_id: this.stepForDelete.workflow_type_id });
      }
    })
  }

  checkFieldInvalid(field) {
    return this.createPlacementType.get(field)?.invalid && (this.createPlacementType.get(field)?.dirty || this.createPlacementType.get(field)?.touched);
  }

  // async drop(event: DndDropEvent, steps) {

  //   console.log("event: CdkDragDrop<string[]>, steps", event, steps)
  //   this.isWILWritePermission = await this.ngxPermissionService.hasPermission('WIL_Write');
  //   if (!this.isWILWritePermission) {
  //     this.service.showMessage({message: 'permission not allowed'});
  //     return;
  //   }

  //   this.dragging = true;
  //   if (event.previousContainer === event.container) {
  //     this.dragging = true;
  //     // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //     moveItemInArray(steps, event.previousIndex, event.currentIndex);
  //   } else {
  //     this.dragging = false;
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex,
  //     );
  //   }


  //   this.updateTaskOrder(steps);
  //   console.log("steps", steps)

  // }

  async drop(event: any, steps: any[],  stepId, workflowTypeId, stage) {
    console.log("DndDropEvent:", event);
    console.log("Steps before:", steps,  stepId, workflowTypeId, stage);


    if(event && event.data && event.data._id){
        let find = await steps.find(el=>el.completion_criteria === event.data.completion_criteria && el.name === event.data.name && el.unlock_task_on === event.data.unlock_task_on );
        console.log("find", find)
        if(find){ 
          // return false
        }else{
          steps.push(event.data);
          const payload = Object.assign({}, event.data);
          payload['step_id'] = stepId;
          payload['is_default'] = true;
          payload['workflow_type_id'] = workflowTypeId;
          payload['stage'] = stage;

          this.service.createTask(payload).subscribe((response: any) => {
            // if (response.status == HttpResponseCode.SUCCESS) {
            //   this.service.showMessage({message: response.msg});
            //   this.router.navigate([URL], navigationExtras);
            // }
            this.getWorkflowTask(stage, { workflow_type_id: workflowTypeId });
          })
          
        }
    }else{
      this.dragging = true;
      if (event.previousContainer === event.container) {
        this.dragging = true;
        // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        moveItemInArray(steps, event.previousIndex, event.currentIndex);
      } else {
        this.dragging = false;
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }
    }
  
    
    this.updateTaskOrder(steps);
    console.log("Steps after:", steps);

    // return false

    // this.isWILWritePermission = await this.ngxPermissionService.hasPermission('WIL_Write');
    // if (!this.isWILWritePermission) {
    //   this.service.showMessage({ message: 'Permission not allowed' });
    //   return;
    // }

    // const draggedItem = event.data;
    // const fromStepIndex = event.data.fromStepIndex;
    // const toStepIndex = event.index !== undefined ? event.index : steps.length - 1;

    // if (fromStepIndex !== undefined && toStepIndex !== undefined) {
    //   const fromStep = steps[fromStepIndex];
    //   const toStep = steps[toStepIndex];

    //   // Remove from previous step
    //   const fromTasks = fromStep.tasks;
    //   const taskIndex = fromTasks.findIndex(task => task.id === draggedItem.id);
    //   if (taskIndex > -1) {
    //     fromTasks.splice(taskIndex, 1);
    //   }

    //   // Add to new step
    //   toStep.tasks.splice(event.index ?? toStep.tasks.length, 0, draggedItem);

    //   this.updateTaskOrder(steps);
    //   console.log("Steps after:", steps);
    // }
  }


  async updateTaskOrder(array: any) {

    await array.map((el, key) => {
      el.priority = key + 1;
    });

    console.log("array", array);
    // return false;

    let body = {
      task_arrange: array
    }
    this.service.arrangeTask(body).subscribe((response) => {
      console.log(response, "response");
      // if (response.status == HttpResponseCode.SUCCESS) {
      //   this.getPlacementTypes();
      // }
    })
  }

  async onStepDrop(e: any, stepId, workflowTypeId, stage) {
    this.isWILWritePermission = await this.ngxPermissionService.hasPermission('WIL_Write');
    if (!this.isWILWritePermission) {
      this.service.showMessage({message: 'permission not allowed'});
      return;
    }
    console.log(e);
    const payload = Object.assign({}, e.dragData);
    payload['step_id'] = stepId;
    payload['is_default'] = true;
    payload['workflow_type_id'] = workflowTypeId;
    payload['stage'] = stage;

    this.service.createTask(payload).subscribe((response: any) => {
      // if (response.status == HttpResponseCode.SUCCESS) {
      //   this.service.showMessage({message: response.msg});
      //   this.router.navigate([URL], navigationExtras);
      // }
      this.getWorkflowTask(stage, { workflow_type_id: workflowTypeId });
    })
  }

  async onPlacementDrop(e: any, data:any) {
    console.log("e: any, data:any", e, data, e.item.data)
    this.isWILWritePermission = await this.ngxPermissionService.hasPermission('WIL_Write');
    if (!this.isWILWritePermission) {
      this.service.showMessage({message: 'permission not allowed'});
      return;
    }
    const payload = {
      workflow_type_id: e.item.data._id, // e.dragData._id,
      placement_id: this.placementId
    }

    this.service.duplicateWorkFlow(payload).subscribe((response: any) => {
      this.getPlacementTypes();
    })
  }

  getPlacementDetails(detail) {
    this.placementGroupDetail = detail;
  }

  selectPlacementTypeForDelete(placementType) {
    this.selectedPlacementType = placementType;
  }

  selectPlacementTypeForFavorite(placementType) {
    this.selectedPlacementType = placementType;
  }

  onDeletePlacementType() {
    let payload = {
      placement_id: this.placementId,
      workflow_type_id: this.selectedPlacementType?.workflow_type_id
    }

    this.service.deletePlacementType(payload).subscribe((response) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.getPlacementTypes();
      }
    })
  }

  getEmailCategories() {
    this.service.getEmailTemplateCategories().subscribe((response: any) => {
      this.categories = response.data;
    });
  }

  onSelectTask(task) {
    this.selectedTask = task;
  }

  selectCategory(event) {
    const payload = {
      category_id: event
    }
    this.service.getEmailTemplateByCategoryId(payload).subscribe((response: any) => {
      this.emailTemplateList = response.result;
    });
  }

  selectTemplate(event) {
    const foundTemplate = this.emailTemplateList.find(template => template._id === event);
    if (foundTemplate) {
      this.emailReminder.patchValue({
        subject: foundTemplate?.subject,
        message: foundTemplate?.message
      });
      this.selectedTemplate = foundTemplate;
      this.selectedTemplate.widgets.values.forEach((email: any) => {
        if (email.data.id=="text") {
          this.emailReminder.patchValue({
            employer_html: email.data.elementData.value
          })
        //  this.text = email.data.elementData.value;
        }
      });
      this.selectedTemplate.widget = this.sanitizer.bypassSecurityTrustHtml(foundTemplate.widgets.html);
    }
  }

  cancelEmail() {
    this.emailReminder.reset();
  }

  @ViewChild('dynamicContainer', { static: false }) dynamicContainer!: ElementRef;
  sendEmail() {
    console.log("selectedTask", this.selectedTask);
    if (this.emailReminder.invalid) {
      this.emailReminder.markAllAsTouched();
      return;
    }

    const containerElement = this.dynamicContainer.nativeElement;

    // Hide the toolbar
    const toolbar = containerElement.querySelector('.ql-toolbar');
    if (toolbar) {
      toolbar.style.display = 'none';
    }
    
    // Hide any additional toolbars with `.ql-hidden`
    const toolbar1 = containerElement.querySelector('.ql-hidden');
    if (toolbar1) {
      toolbar1.style.display = 'none';
    }
 
      // Hide any additional toolbars with `.ql-hidden`
      const attachment = containerElement.querySelector('.attachment');
      if (attachment) {
       attachment.style.display = 'none';
      }
    
    // Replace <quill-editor> with a <div>
    const quillEditor = containerElement.querySelector('quill-editor');
    if (quillEditor) {
      const divElement = document.createElement('div');
      divElement.innerHTML = quillEditor.innerHTML;
      quillEditor.replaceWith(divElement);
    }
    
    // Hide all <input> elements inside the container
    const inputs = containerElement.querySelectorAll('input');
    inputs.forEach((input) => {
      input.style.display = 'none';
    });
    
    // Now get the updated HTML
    const fullHtml = containerElement.innerHTML;
    
    // Construct the email template
    const html = `
    <app-html-email-preview>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" crossorigin="anonymous">
        </head>
        <body style="width: 100%; font-family: 'DM Sans', sans-serif; height: 100%; background: #fff; margin: 0; padding: 0; box-sizing: border-box; text-align: left; font-weight: 390;">
          <table cellspacing="0" cellpadding="0" width="100%" border="0" style="padding: 0; border-collapse: collapse; margin: 0 auto; max-width: 536px; font-size: 14px; font-weight: 400; line-height: 18px; color: #2F2E41;">
            <tbody>
              ${fullHtml}
            </tbody>
          </table>
        </body>
      </html>
    </app-html-email-preview>
    `;

    let payload: any = {
      subject: this.emailReminder.value.subject,
      category_id: this.emailReminder.value.category_id,
      template_id: this.emailReminder.value.template_id,
      message: this.emailReminder.value.message,
      task_id: this.selectedTask._id,
      placement_id: this.placementId,
      placement_type_id:this.selectedTask?.workflow_type_id,
      html: html,
      receiver_type:'student'
    }

    this.service.sendReminderEmail(payload).subscribe((res: any) => {
      this.emailReminder.reset();
      this.closeSendEmailModal.ripple.trigger.click();
      if (res.status == HttpResponseCode.SUCCESS) {
        this.service.showMessage({
          message: "Email sent successfully"
        });
        this.selectedTemplate = null;
        this.emailReminder.reset();
      }
    }, err => {
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });

  }

  saveAsFavorite() {
    const payload = {
      workflow_type_id: this.selectedPlacementType?.workflow_type_id,
      is_favorite: !this.selectedPlacementType?.is_favorite,
      placement_id: this.placementId,
      workflow_code: this.selectedPlacementType?.workflow_code,
      description: this.selectedPlacementType?.description,
      self_source:this.selectedPlacementType?.self_source?this.selectedPlacementType?.self_source:false
    }
    this.service.saveAsFavorite(payload).subscribe((res: any) => {
      if (res.status == HttpResponseCode.SUCCESS) {
        if (!this.selectedPlacementType?.is_favorite) {
          this.service.showMessage({
            message: "Placement Type saved as favorite"
          });
        } else {
          this.service.showMessage({
            message: "Placement Type removed from favorites"
          });
        }
        this.getPlacementTypes();
        this.getAllWorkflowTypes();
      }
    }, err => {
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }

   onEditorCreated(quill: Quill) {
      this.editor = quill;
      this.editor.focus()
    }
    onContentChanged = (event, data) =>{
      if (event.html) {
        data.data.elementData.value = event.html;
        // console.log("event.html", event.html)
      }
    }
    onSelectionChanged(event: any): void {
      console.log('Selection Changed:', event);
    }
  

  chooseValue(){
    // console.log("this.editor", this.editor);
    //   const range = this.editor.getSelection(true);  
    //   if (range) {
    //     // const elementHtml = '<button class="custom-btn" (click)="handleClick()">Click me</button>';
    //     this.editor.clipboard.dangerouslyPasteHTML(range.index, `&nbsp;{{${this.selectedType} : ${this.selectedItem}}}&nbsp;`);
        
    //   }
    if (this.editor) {
      const range = this.editor.getSelection(true);  // Get the current cursor position
  
      if (range) {
          // this.editor.clipboard.dangerouslyPasteHTML(range.index, `&nbsp;{{${this.selectedType} : ${this.selectedItem}}}&nbsp;`);
          // Prepare the placeholder text to be inserted
          const placeholderText = `&nbsp;{{${this.selectedType} : ${this.selectedItem}}}&nbsp;`;
  
          // Insert the placeholder text at the current cursor position
          this.editor.clipboard.dangerouslyPasteHTML(range.index, placeholderText);
  
          // Compute the new cursor position
          const newIndex = range.index + placeholderText.length - 10;
  
          // Move the cursor to the end of the inserted placeholder text with a slight delay
          setTimeout(() => {
              console.log("Setting cursor position to:", newIndex);
              this.editor.setSelection(newIndex, 0);
              this.editor.focus();  // Ensure focus remains in the editor
          }, 10); // Delay ensures Quill processes the update
      } else {
          console.log("No valid selection found in the editor");
      }
  }
      setTimeout(() => {
        if (this.selectedType) {
          this.getKey();
        }
      }, 200);
      this.placeholderModel.hide();
      // this.selectedType = '';
    this.selectedItem = '';
    this.selectedKey = '';
    // this.placeholderList = [];
    // this.filteredplaceholderList = [];
    // this.copyPlacementTypes();
    }
    selectedItem:any = '';
    placeholderList:any = [];
   selectedKey:any = '';
    selectedType:any = '';
    editorContent = '';  // Stores editor content
    editor:Quill;
    @ViewChild('placeholderModel', { static: false }) placeholderModel!: ModalDirective;
    //open model
    insertCustomElement() {
      // this.selectedType = '';
      this.selectedItem = '';
      this.selectedKey = '';
      // this.placeholderList = [];
      // this.copyPlacementTypes();
      // this.closeSendEmailModal.ripple.trigger.click();
      // this.placeholderModel = this.modalService.show(this.placeholderModel, {
      //   ignoreBackdropClick: true,
      //   keyboard: false,
      // });
      this.placeholderModel.show();
      setTimeout(() => {
        this.cdr.detectChanges(); 
        if (this.searchpInput) {
          this.searchpInput.nativeElement.focus();
        }
      }, 300); 
      console.log("this.placeholderModel", this.placeholderModel);
  
    }
  
    @ViewChild('searchpInput') searchpInput: ElementRef;
  
    filteredplaceholderList:any = [];
    copyPlacementTypes1(){
      this.filteredplaceholderList = this.placeholderList;
      // console.log("this.allPlacementTypes", this.filteredplaceholderList);
    }
  
    getKey(){
      this.placeholderList = [];
      this.copyPlacementTypes();
      var obj = {
        type: this.selectedType.toLowerCase()
      }
      this.service.getEmailTemplateKey(obj).subscribe(res => {
        // localStorage.setItem("admin_details",JSON.stringify(res.obj.email))
        if (res.status == 200) {
          this.placeholderList = res.db_fields;
          this.copyPlacementTypes1();
        } else {
          this.placeholderList = [];
        }
       
      }, err => {
        this.service.showMessage({
          message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
        })
  
      }
      );
    }
  
    search(){
  
    }
  
    @ViewChild('searchInput') searchInput!: ElementRef;
  
    setFocus() {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 0);
    }
  
    applyFilter1(filterValue) {

      this.selectedKey = filterValue.target.value
      this.filteredplaceholderList = this.placeholderList.filter(item => {
        return item.title?.toString().toLowerCase().includes(this.selectedKey.toLowerCase());
      });

    }

  // === Doc. Library Methods ===
  loadDocFolders() {
    this.service.getDocFolders({ placement_id: this.placementId }).subscribe((res: any) => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.docLibraryFolders = (res.data || []).map(f => ({ ...f, expanded: false }));
      }
    });
  }

  createDocFolder() {
    const folderName = 'New Folder ' + (this.docLibraryFolders.length + 1);
    this.service.createDocFolder({ placement_id: this.placementId, name: folderName }).subscribe((res: any) => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.docLibraryFolders.push({ _id: res.data._id, name: folderName, files: [], expanded: false });
      }
    });
  }

  openRenameFolderModal(index: number) {
    this.renameFolderIndex = index;
    this.renameFolderName = this.docLibraryFolders[index].name;
  }

  confirmRenameFolder() {
    if (this.renameFolderIndex >= 0 && this.renameFolderName.trim()) {
      const folder = this.docLibraryFolders[this.renameFolderIndex];
      const newName = this.renameFolderName.trim();
      this.service.updateDocFolder({ folder_id: folder._id, name: newName }).subscribe((res: any) => {
        if (res.status == HttpResponseCode.SUCCESS) {
          folder.name = newName;
        }
      });
    }
    this.renameFolderIndex = -1;
    this.renameFolderName = '';
  }

  openDeleteFolderModal(index: number) {
    this.deleteFolderIndex = index;
  }

  confirmDeleteFolder() {
    if (this.deleteFolderIndex >= 0) {
      const folder = this.docLibraryFolders[this.deleteFolderIndex];
      this.service.deleteDocFolder({ folder_id: folder._id }).subscribe((res: any) => {
        if (res.status == HttpResponseCode.SUCCESS) {
          this.docLibraryFolders.splice(this.deleteFolderIndex, 1);
        }
        this.deleteFolderIndex = -1;
      });
    }
  }

  openDeleteFileModal(folderIndex: number, fileIndex: number) {
    this.deleteFileFolder = folderIndex;
    this.deleteFileIndex = fileIndex;
    this.deleteFileName = this.docLibraryFolders[folderIndex]?.files[fileIndex]?.name || '';
  }

  onDocFileUpload(event: any, folderIndex: number) {
    const fileInput = event.target;
    const files = fileInput.files;
    if (!files || files.length === 0) return;
    const maxSize = 25 * 1024 * 1024; // 25MB
    const fileArray = Array.from(files) as File[];
    if (fileArray.some(file => file.size > maxSize)) {
      this.service.showMessage({ message: 'Please select file less than 25 MB' });
      fileInput.value = '';
      return;
    }
    const folder = this.docLibraryFolders[folderIndex];
    fileArray.forEach((file) => {
      const formData = new FormData();
      formData.append('media', file);
      this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
        folder.files.push(resp);
        this.service.updateDocFolder({ folder_id: folder._id, file: resp }).subscribe();
      });
    });
    fileInput.value = '';
  }

  viewDocFile(folderIndex: number, fileIndex: number) {
    const file = this.docLibraryFolders[folderIndex].files[fileIndex];
    if (file.url) {
      window.open(file.url, '_blank');
    }
  }

  confirmDeleteFile() {
    if (this.deleteFileFolder >= 0 && this.deleteFileIndex >= 0) {
      const folder = this.docLibraryFolders[this.deleteFileFolder];
      const file = folder.files[this.deleteFileIndex];
      if (file && file.url) {
        this.service.deleteFileS3({ file_url: file.url }).subscribe(res => {
          if (res.status == HttpResponseCode.SUCCESS) {
            folder.files.splice(this.deleteFileIndex, 1);
            this.service.updateDocFolder({ folder_id: folder._id, file_url: file.url }).subscribe();
          } else {
            this.service.showMessage({ message: res.msg });
          }
          this.deleteFileFolder = -1;
          this.deleteFileIndex = -1;
          this.deleteFileName = '';
        }, err => {
          this.service.showMessage({ message: err.error?.errors?.msg || 'Something went wrong' });
          this.deleteFileFolder = -1;
          this.deleteFileIndex = -1;
          this.deleteFileName = '';
        });
      } else {
        folder.files.splice(this.deleteFileIndex, 1);
        this.deleteFileFolder = -1;
        this.deleteFileIndex = -1;
        this.deleteFileName = '';
      }
    }
  }

  confirmImportPublished() {
    // TODO: implement import/overwrite logic
  }
}