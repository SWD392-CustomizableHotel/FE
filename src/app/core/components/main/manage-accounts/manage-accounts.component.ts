import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Account } from '../../../../interfaces/models/account';
import { Role } from '../../../../interfaces/models/role';
import { AccountService } from '../../../../services/account.service';

@Component({
  selector: 'app-manage-accounts',
  templateUrl: './manage-accounts.component.html',
  styleUrls: ['./manage-accounts.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ManageAccountsComponent implements OnInit {
  accounts: Account[] = [];
  account: Account = { id: '' };
  selectedRole?: Role;
  roleOptions: Role[] = [{ name: 'Admin', normalizedName: 'ADMIN' }, { name: 'Staff', normalizedName: 'STAFF' }];
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

  constructor(
    private accountService: AccountService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.accountService.getAccounts(this.first / this.rows, this.rows).subscribe({
      next: (data) => {
        this.accounts = data.results as Account[];
        this.totalRecords = data.totalRecords;
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

  openNew(): void {
    this.account = {
      id: ''
    };
    this.accountDialog = true;
  }

  editAccount(account: Account): void {
    this.account = { ...account };
    this.accountDialog = true;
  }

  saveAccount(): void {
    this.submitted = true;
    if (this.account.userName?.trim() && this.account.email?.trim()) {
      if (this.account.id) {
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
