import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Post } from './post.model';


@Injectable({ providedIn: 'root' })
export class PostsService {
    error = new Subject<string>();

    constructor(private http: HttpClient) { }

    createAndStorePost(title: string, content: string) {
        const postData: Post = {
            title: title,
            content: content
        };
        // Send Http request
        //console.log(postData);
        let success = false;
        return this.http.post<{ name: string }>('https://angular-course-851b1.firebaseio.com/posts.json', postData,
            {
                observe: 'response'
            }
        ).subscribe(
            responseData => console.log(responseData),
            error => this.error.next(error.message));
    }

    fetchPosts() {
        let searchParams = new HttpParams();
        searchParams.append("print", "pretty");
        searchParams.append("custom", "key");
        return this.http.get<{ [key: string]: Post }>('https://angular-course-851b1.firebaseio.com/posts.json', {
            headers: new HttpHeaders({ "Custom-header": "hello" }),
            params: searchParams
        })
            .pipe(map((responseData) => {
                const postsArray: Post[] = [];
                for (const key in responseData) {
                    if (responseData.hasOwnProperty(key)) {
                        postsArray.push({ ...responseData[key], id: key });
                    }
                }
                //console.log(postsArray);
                return postsArray;
            }),
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }

    deletePosts() {
        return this.http.delete('https://angular-course-851b1.firebaseio.com/posts.json',
            {
                observe: 'events'
            }
        ).pipe(
            tap(event => {
                console.log(event);
                if (event.type === HttpEventType.Sent) {
                    //...
                }
                if (event.type === HttpEventType.Response) {
                    console.log(event.body);
                }
            }
            ));
    }
}