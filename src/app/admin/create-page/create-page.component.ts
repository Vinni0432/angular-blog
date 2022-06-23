import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Post } from 'src/app/shared/components/interfaces';
import { PostsService } from 'src/app/shared/posts.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {

  form: FormGroup |any

  constructor(
    private postsService:PostsService,
    private alert:AlertService,

    ) {

   }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required),
      author: new FormControl('', Validators.required)
    })
  }

  submit(){
  if(this.form.invalid){
    return
  }
  const post: Post = {
    id: this.form.value.id,
    title: this.form.value.title,
    author: this.form.value.author,
    text: this.form.value.text,
    date: new Date()
  }
  this.postsService.create(post).subscribe(() => {
    this.form.reset()
    this.alert.success('Посту був створений')
  } )
  }
}
