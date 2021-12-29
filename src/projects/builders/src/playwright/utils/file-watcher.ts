import { FSWatcher, watch } from 'chokidar';
import { Observable, fromEventPattern } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export class FileWatcherService {
  private filePath: string[];
  private watch$: Observable<unknown> | null = null;

  constructor(path: string | string[]) {
    this.filePath = Array.isArray(path) ? path : [path];
  }

  change(): Observable<unknown> {
    if (!this.watch$) {
      this.watch$ = this.initializeWatcher()
    }
    return this.watch$
  }

  private initializeWatcher(): Observable<unknown> {
    const watcher = watch(this.filePath)
    const change$ = fromEventPattern(this.createHandler(watcher, 'change'))
    const ready$ = fromEventPattern(this.createHandler(watcher, 'ready'))

    return ready$.pipe(switchMap(() => change$))
  }

  private createHandler(watcher: FSWatcher, event: string) {
    return (handler: (path: string, stats: unknown) => void) => {
      watcher.on(event, (path: string, stats) => handler(path, stats))
    }
  }
}
