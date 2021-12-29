import { FSWatcher, watch } from 'chokidar';
import { Stats } from 'fs';
import { Observable, fromEventPattern } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export class FileWatcherService {
  private watch$: Observable<[string, Stats]> | null = null;

  constructor(private readonly directories: string[]) {}

  change(): Observable<[string, Stats]> {
    if (!this.watch$) {
      this.watch$ = this.initializeWatcher()
    }
    return this.watch$
  }

  private initializeWatcher(): Observable<[string, Stats]> {
    const watcher = watch(this.directories)
    const change$ = fromEventPattern<[string, Stats]>(this.createHandler(watcher, 'change'))
    const ready$ = fromEventPattern(this.createHandler(watcher, 'ready'))

    return ready$.pipe(switchMap(() => change$))
  }

  private createHandler(watcher: FSWatcher, event: string) {
    return (handler: (path: string, stats: unknown) => void) => {
      watcher.on(event, (path: string, stats) => handler(path, stats))
    }
  }
}
