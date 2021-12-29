import { BuilderOutput } from "@angular-devkit/architect"
import { ChildProcess, spawn } from "child_process"
import { Observable, Subject } from "rxjs"

export class PlaywrightService {
  private process: ChildProcess | null = null
  
  private out$: Subject<BuilderOutput> = new Subject();

  private emit = true;

  run(_path?: string): Observable<BuilderOutput> {
    if (this.process) {
      this.process.kill()
      this.emit = false
    }

    // playwright
    const playwrightCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx'
    const playwrightArgs: string[] = ['playwright', 'test', '--config=e2e/playwright.conf.ts']

    this.process = spawn(playwrightCommand, playwrightArgs, {
      stdio: 'inherit'
    })

    this.process.on('exit', () => {
      this.notify({ success: true, error: '' })
      this.process = null;
      this.emit = true
    })

    this.process.on('error', (error) => this.notify({ success: false, error: error.message }))
    return this.out$.asObservable();
  }

  private notify(result: BuilderOutput) {
    if (this.emit) {
      this.out$.next(result)
    }
  }
}
