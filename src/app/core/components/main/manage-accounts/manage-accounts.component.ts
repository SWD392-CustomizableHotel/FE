import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Account } from '../../../../interfaces/models/account';
import { AccountService } from '../../../../services/account.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog/dynamicdialog-ref';
import { AssignServiceComponent } from './assign-service-component/assign-service.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-manage-accounts',
  templateUrl: './manage-accounts.component.html',
  styleUrls: ['./manage-accounts.component.scss'],
  providers: [ConfirmationService, MessageService, DialogService]
})
export class ManageAccountsComponent implements OnInit {
  accounts: Account[] = [];
  account: Account = { id: '' };
  selectedRole?: string;
  roleOptions: string[] = ['CUSTOMER', 'STAFF'];
  accountDialog: boolean = false;
  submitted: boolean = false;
  deleteAccountDialog: boolean = false;
  loading: boolean = true;
  rows: number = 10;
  cols: any[] = [];
  first: number = 0;
  totalRecords: number = 0;
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
  ];
  ref: DynamicDialogRef | undefined;

  constructor(
    private accountService: AccountService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.accountService.getAccounts(this.first / this.rows, this.rows).subscribe({
      next: (data) => {
        this.accounts = data.data.filter((account: Account) => {
          return !account.roles?.includes('ADMIN');
        });
        this.totalRecords = this.accounts.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onGlobalFilter(dt: any, event: any): void {
    dt.filterGlobal(event.target.value, 'contains');
  }

  onRowsChange(event: any): void {
    this.rows = event;
    this.loadAccounts();
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.loadAccounts();
  }

  clear(dt: any): void {
    dt.clear();
  }

  assignService(account: Account): void {
    this.ref = this.dialogService.open(AssignServiceComponent, {
      header: 'Select a Service',
      width: '95%',
      contentStyle: { overflow: 'auto' },
      breakpoints: {
          '960px': '75vw',
          '640px': '90vw'
      },
    });

    this.ref.onClose.subscribe((data: any) => {
      let service;
      if (data) {
          const buttonType = data?.buttonType;
          this.accountService.assignService(account.id, data.serviceId).subscribe(
            {
              next: (response) => {
                if(response.isSucceed && buttonType) {
                  service = { summary: 'Service Assigned', detail: data?.name };
                } else {
                  service = { summary: 'Assigned Failed' };
                }
              },
              error: (error) => {
                service = { summary: 'Error', detail: error };
              }
            }
          );
      } else {
          service = { summary: 'No Service Selected', detail: '' };
      }
      this.messageService.add({ severity: 'info', ...service, life: 3000 });
  });
  }

  editAccount(account: Account): void {
    this.account = { ...account };
    this.selectedRole = this.account.roles ? this.account.roles[0] : undefined;
    this.accountDialog = true;
  }

  saveAccount(): void {
    this.submitted = true;
    if (this.account.userName?.trim() && this.account.email?.trim()) {
      if (this.account.id) {
        this.account.roles = this.selectedRole ? [this.selectedRole] : [];
        this.accountService.updateAccount(this.account.id, this.account).subscribe({
          next: () => {
            this.loadAccounts();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Account Updated', life: 3000 });
          }
        });
      }
      this.accountDialog = false;
      this.account = {
        id: ''
      };
    }
  }

  hideDialog(): void {
    this.accountDialog = false;
    this.submitted = false;
  }

  confirmDelete(account: Account): void {
    this.account = account;
    this.deleteAccountDialog = true;
  }

  confirmDeleteAccount(): void {
    this.accountService.deleteAccount(this.account.id).subscribe({
      next: () => {
        this.loadAccounts();
        this.deleteAccountDialog = false;
        this.account = {
          id : ''
        };
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Account Deleted', life: 3000 });
      }
    });
  }
}
