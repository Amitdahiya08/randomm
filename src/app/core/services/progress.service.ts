import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs';

export interface LectureProgress {
    id?: number;
    userId: number;
    courseId: number;
    lectureId: number;
    completed: boolean;
    seconds: number;
}

@Injectable({ providedIn: 'root' })
export class ProgressService {
    private http = inject(HttpClient);
    private API = 'http://localhost:3000';

    list(userId: number, courseId: number) {
        return this.http.get<LectureProgress[]>(`${this.API}/progress?userId=${userId}&courseId=${courseId}`);
    }

    upsert(record: LectureProgress) {
        const q = `${this.API}/progress?userId=${record.userId}&courseId=${record.courseId}&lectureId=${record.lectureId}`;
        return this.http.get<LectureProgress[]>(q).pipe(
            switchMap(list => {
                if (list.length) {
                    const existing = list[0];
                    return this.http.patch<LectureProgress>(`${this.API}/progress/${existing.id}`, {
                        completed: record.completed ?? existing.completed,
                        seconds: record.seconds ?? existing.seconds
                    });
                }
                return this.http.post<LectureProgress>(`${this.API}/progress`, record);
            })
        );
    }

    setCompleted(userId: number, courseId: number, lectureId: number, completed: boolean) {
        return this.upsert({ userId, courseId, lectureId, completed, seconds: 0 });
    }

    setSeconds(userId: number, courseId: number, lectureId: number, seconds: number) {
        return this.upsert({ userId, courseId, lectureId, completed: false, seconds });
    }
}
