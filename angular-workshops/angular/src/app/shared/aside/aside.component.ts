import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { IPost } from '../../shared/interfaces';
import { PostService } from '../../post/post.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent{

  @Input() title: string;
  
}
