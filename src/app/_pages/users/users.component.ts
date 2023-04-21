import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '@app/_state/users/users-store';
import { MaterialExampleModule } from '@app/material.module';
import { UserService } from './users.service';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MaterialExampleModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [UserService]
})
export class UsersComponent implements OnInit {
  userData: User[] = [];
  columnsToDisplay = ['firstName', 'maidenName', 'lastName', 'age', 'gender', 'email', 'phone', 'birthDate'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: User | null = null;
  dataSource = new MatTableDataSource<User>(this.userData.map(x => ({ ...x, form: this.createForm(x) })));
  isLoader: boolean = false;

  constructor(private userService: UserService) {
    this.userService.getUsers().subscribe((res: any) => {
      console.log(res);
      let trancheData = res;
      this.userData = trancheData as User[];
      this.dataSource = new MatTableDataSource<User>(this.userData.map(x => ({ ...x, form: this.createForm(x) })));
      this.dataSource.paginator = this.paginator;
    })
  }

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  ngOnInit(): void {
  }

  createForm(data: any) {
    return new FormGroup({
      id: new FormControl(data.id, [Validators.required]),
      firstName: new FormControl(data.firstName, [Validators.required]),
      maidenName: new FormControl(data.maidenName, [Validators.required]),
      lastName: new FormControl(data.lastName, [Validators.required]),
      age: new FormControl(data.age, [Validators.required]),
      gender: new FormControl(data.gender, [Validators.required]),
      email: new FormControl(data.email, [Validators.required]),
      phone: new FormControl(data.phone, [Validators.required]),
      birthDate: new FormControl(data.birthDate, [Validators.required]),
    });
  }

  cancel(form: FormGroup, data: any) {
    form.patchValue(data);
    this.expandedElement = null;
  }

  updateRow(form: FormGroup, data: any) {
    this.isLoader = true;
    this.userService.updateUser(form.value).subscribe(response => {
      console.log(response);
      form.patchValue(response)
      let userDataToUpdate = this.dataSource.data;
      const updatedIndex = userDataToUpdate.findIndex((obj => obj.id === response.id));
      userDataToUpdate[updatedIndex] = response;
      this.dataSource = new MatTableDataSource<User>(userDataToUpdate.map(x => ({ ...x, form: this.createForm(x) })));
      this.dataSource.paginator = this.paginator;
      this.isLoader = false;
      this.expandedElement = null;
    }, err => {
      this.isLoader = false;
    });
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}

const userData: PeriodicElement[] = [];
