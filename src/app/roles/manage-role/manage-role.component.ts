import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/utils.service';
import { RolesService } from '../roles.service';

@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.scss'],
})
export class ManageRoleComponent implements OnInit {
  permissionsGroups = [];
  roleName: string | null = '';
  roleDesc: string | null = '';
  roleId: string | number | null = '';
  role!: any;

  constructor(
    private utlisService: UtilsService,
    private router: Router,
    private rolesService: RolesService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((params) => {
      this.roleId = params.get('id');
    });
  }

  ngOnInit() {
    this.getRoleDetails();
  }

  getRoleDetails() {
    this.rolesService.getRoleById(this.roleId).subscribe((res: any) => {
      if (res.success) {
        this.role = res.result;
        this.roleName = res.result.name;
        this.roleDesc = res.result.description;
      }
    });
  }

  updateRoleDetails(updateForm: any) {
    this.rolesService
      .createOrUpdateRole({ ...updateForm, id: Number(this.roleId) })
      .subscribe((res: any) => {
        if (res.success) {
          this.utlisService.showSuccessToast(res.message);
          this.getRoleDetails();
          this.utlisService.getUserInfo();
          this.router.navigate(['roles/manage-role', { id: this.roleId }]);
        } else {
          this.utlisService.showErrorToast(res.message);
        }
      });
  }
}
