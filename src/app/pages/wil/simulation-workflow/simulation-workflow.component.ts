import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpResponseCode } from 'src/app/shared/enum';
import { TopgradserviceService } from 'src/app/topgradservice.service';
import { Utils } from 'src/app/shared/utility';

@Component({
  selector: 'app-simulation-workflow',
  templateUrl: './simulation-workflow.component.html',
  styleUrls: ['./simulation-workflow.component.scss']
})
export class SimulationWorkflowComponent implements OnInit {
  placementId: any = '';

  // Doc. Library
  docLibraryFolders: any[] = [];
  renameFolderName: string = '';
  renameFolderIndex: number = -1;
  deleteFolderIndex: number = -1;
  deleteFileFolder: number = -1;
  deleteFileIndex: number = -1;
  deleteFileName: string = '';

  // Workflow
  workflowTitle = 'F1 Advanced Data Analyst Workflow';
  isFavorite = true;
  placementGroupDetails: any = {};
  taskList: any[] = [];
  selectedTask: any = {};
  selectedPTabIndex: number = 0;
  taskOfPlacementType: any[] = [];

  workflowTasks: any[] = [];

  // Workflows tab (left sidebar)
  allPlacementTypes: any[] = [];
  displayedPlacementTypes: any[] = [];
  pageSize = 20;
  currentPage = 0;
  isLoadingMore = false;

  // Placeholder
  placeholderList: any = [];
  filteredplaceholderList: any = [];
  selectedKey: any = '';

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: TopgradserviceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.placementId = params.get('id');
    });
    this.loadDocFolders();
    this.getAllTask();
    this.getAllWorkflowTypes();
    this.getPlacementGroupDetails();
  }

  refreshData() {
    this.loadDocFolders();
    this.getAllTask();
    this.getAllWorkflowTypes();
  }

  getPlacementGroupDetails() {
    const payload = { id: this.placementId };
    this.service.getPlacementGroupDetails(payload).subscribe((response: any) => {
      this.placementGroupDetails = response.result;
    });
  }

  getAllTask() {
    const payload = { placement_id: this.placementId };
    this.service.getAllTask(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.taskList = response.result;
      } else {
        this.taskList = [];
      }
    });
  }

  onSlectedTask(task) {
    this.selectedTask = task;
  }

  // === Workflows Tab (left sidebar list) ===
  getAllWorkflowTypes() {
    this.service.getAllWorkflowTypes({ placement_id: this.placementId }).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.allPlacementTypes = response.result.map(item => ({
          ...item,
          selected: false,
          publish_at: Utils.convertDate(Number(item?.publish_at), 'DD/MM/YY')
        }));
        this.loadMore();
      }
    });
  }

  loadMore() {
    if (this.isLoadingMore) return;
    this.isLoadingMore = true;
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    const nextItems = this.allPlacementTypes.slice(start, end);
    if (nextItems.length > 0) {
      this.displayedPlacementTypes = [...this.displayedPlacementTypes, ...nextItems];
      this.currentPage++;
    }
    this.isLoadingMore = false;
    this.cdr.markForCheck();
  }

  trackByPlacementType(index: number, item: any): any {
    return item._id || item.placement_group_title || index;
  }

  applyFilter(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = this.allPlacementTypes.filter(item =>
      item.placement_group_title?.toLowerCase().includes(searchTerm) ||
      item.type?.toLowerCase().includes(searchTerm)
    );
    this.displayedPlacementTypes = filtered.slice(0, this.pageSize);
    this.currentPage = 1;
  }

  getWorkflowTaskOfPlacementType(stage, placementType) {
    const payload = {
      placement_id: placementType.placement_id,
      stage: stage,
      workflow_type_id: placementType._id
    };
    this.service.getWorkflowTask(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.taskOfPlacementType = response.result;
      }
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


  // Placeholder helpers
  copyPlacementTypes1() {
    this.filteredplaceholderList = this.placeholderList;
  }

  setFocus() {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 0);
  }

  applyFilter1(filterValue) {
    this.selectedKey = filterValue.target.value;
    this.filteredplaceholderList = this.placeholderList.filter(item => {
      return item.title?.toString().toLowerCase().includes(this.selectedKey.toLowerCase());
    });
  }
}
