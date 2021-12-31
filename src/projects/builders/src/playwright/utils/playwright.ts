import { BuilderOutput } from "@angular-devkit/architect"
import { ChildProcess, spawn } from "child_process"
import { Observable, Subject } from "rxjs"
import { PlaywrightTestConfig } from "@playwright/test"
import { dirname, join, relative } from "path"

export class PlaywrightService {
  private process: ChildProcess | null = null
  
  private out$: Subject<BuilderOutput> = new Subject()

  private configuration: PlaywrightTestConfig | null = null

  private rootDir: string | null = null

  private emit = true

  constructor(private readonly configPath: string) {}

  destroy() {
    this.out$.complete()
    if (this.process) {
      this.process.kill()
    }
  }

  async initialize() {
    this.configuration = await import(this.configPath) as PlaywrightTestConfig
    this.rootDir = join(dirname(this.configPath), this.configuration.testDir ?? '.')
  }

  run(path?: string): Observable<BuilderOutput> {
    if (this.process) {
      this.emit = false
      this.process.kill()
    }

    // playwright
    const playwrightCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx'
    const playwrightArgs: string[] = ['playwright', 'test', `--config=${this.configPath}`]

    if (path && path.trim() !== '') {
      // for windows systems we get something like this foo\\file.spec.ts which not works
      // together with playwright since he do not understand this one (even on windows)
      // and replace with foo/file.spec.ts
      playwrightArgs.push(relative(this.rootDir ?? '.', path).replace(/\\/g, '/'))
    }

    this.process = spawn(playwrightCommand, playwrightArgs, {
      stdio: 'inherit'
    })

    this.process.on('exit', () => {
      this.notify({ success: true, error: '' })
      this.process = null
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
