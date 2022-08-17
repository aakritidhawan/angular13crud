import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponent } from 'src/app/app.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  itemSources = ['local', 'imported', 'inter-state'];
  itemCategories = ['Fruits', 'Veggies', 'Breads', 'Dairy'];
  itemForm!: FormGroup;
  actionType = 'Save';
  @Input() myItems: any;

  constructor(private fb: FormBuilder, private apiService: ApiService, private matDialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any) { 
    this.itemForm = this.fb.group({
      itemName: ['', Validators.required],
      itemCategory: ['', Validators.required],
      itemDateOfArrival: ['', Validators.required],
      itemSource: ['', Validators.required],
      itemPrice: ['', Validators.required],
      comments: ['']
    })
  }

  ngOnInit(): void {
    if (this.data) {
      this.itemForm.patchValue({itemName: this.data.itemName, itemCategory: this.data.itemCategory, itemDateOfArrival: this.data.itemDateOfArrival,
        itemSource: this.data.itemSource, itemPrice: this.data.itemPrice, comments: this.data.comments});
      this.actionType = 'Update';  
    }
    console.log('data', this.data)
  }


  callActionCorrespondingAPI() {
    this.actionType === 'Save' ? this.onSubmit() : this.onUpdate();
  }

  onSubmit() {
    console.log('form values', this.itemForm.value);
    this.apiService.createNewItem(this.itemForm.value).subscribe({
      next: (res) => {
        console.log('created!');
        this.matDialogRef.close('save');
      }, error: (err) => console.error('error occurred!')
  });
}

  onUpdate() {
  this.apiService.updateItem(this.itemForm.value, this.data.id).subscribe({
    next: (res) => {
      this.matDialogRef.close('update');
    },
    error: (err) => {}
  })
}

}
