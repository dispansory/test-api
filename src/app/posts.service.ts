import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../environments/environment";
import { Post } from "./post.model";

const BACKEND_URL_1 = environment.api_url + "/posts";
const BACKEND_URL_2 = environment.api_url + "/post/";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>()

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    //returns an array contain a copy of posts array or a reference to posts array. Trick not advisable if you want to modify the base array
    // return [...this.posts]
    // return this.posts
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, posts: any, maxPosts: number}>(BACKEND_URL_1 + queryParams)
      .pipe(map((postData) => {
        return {
         posts: postData.posts.map(post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
              creator: post.creator
            }
          }),
          maxPosts: postData.maxPosts
        }
      }))
      .subscribe((transformedPost) => {
        this.posts = transformedPost.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: transformedPost.maxPosts});
      });
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable()
  }

  getPost(postId: string) {
    //avoiding to alter the original data by just sending an object using the spread operator which correspond to the id we are looking for
    // return {...this.posts.find(p => p.id === postId)};
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string
    }>(BACKEND_URL_2 + postId);
  }

  AddPost(title: string, content: string, image: File) {
    const postData = new FormData(); //allow us to combine file values since we intend to upload file to the server such as an image (.png, .jpg, jpeg in our case)
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    // const post: Post = {id: null, title: title, content: content};
    this.http.post<{message: string, post: Post}>(BACKEND_URL_1, postData)
      .subscribe((responseData) => {
        // const post: Post = {
        //   id: responseData.post.id,
        //   title: title,
        //   content: content,
        //   imagePath: responseData.post.imagePath
        // }
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  updatePost(postId: string, postTitle: string, postContent: string, image: File | string) {
    let postData: Post | FormData;
    //if image is passed as a file uploaded
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", postId),
      postData.append("title", postTitle);
      postData.append("content", postContent)
      postData.append("image", image, postTitle)
    } else { //if image is passed directly as a string
      postData = {
        id: postId,
        title: postTitle,
        content: postContent,
        imagePath: image,
        creator: null
      }
    }
    this.http.put(BACKEND_URL_2 + postId, postData)
      .subscribe(response => {
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === postId);
        // const post: Post = {
        //   id: postId,
        //   title: postTitle,
        //   content: postContent,
        //   imagePath: ""
        // }
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL_2 + postId);
      // .subscribe(() => {
      //   const updatedPosts = this.posts.filter(post => post.id !== postId);
      //   this.posts = updatedPosts;
      //   this.postsUpdated.next([...this.posts]);
      // });
  }
}
