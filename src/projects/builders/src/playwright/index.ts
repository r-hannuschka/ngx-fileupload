import { BuilderOutput, createBuilder, BuilderContext, targetFromTargetString, BuilderRun } from '@angular-devkit/architect'
import { State } from '@angular-devkit/architect/src/progress-schema';
import { Stats } from 'fs';
import { resolve as pathResolve } from 'path';
import { from, Observable, merge, EMPTY } from 'rxjs';
import { filter, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { FileWatcherService } from './utils/file-watcher';
import { PlaywrightService } from './utils/playwright';

interface PLAYWRIGHT_BUILDER_OPTIONS {
  devServerTarget: string
  playwrightConfig: string
  watch: boolean
  watchDir: string[]
}

function playwrightBuilder(
  options: PLAYWRIGHT_BUILDER_OPTIONS,
  context: BuilderContext
): Observable<BuilderOutput> | Promise<BuilderOutput> {

  const configPath = pathResolve(context.workspaceRoot, options.playwrightConfig)
  const playwrightService = new PlaywrightService(configPath)

  let server: BuilderRun | null = null;

  // startup
  const main$ = from(playwrightService.initialize())
    .pipe(
      switchMap(() => {
        const target = targetFromTargetString(options.devServerTarget)
        return context.scheduleTarget(target)
      }),
      switchMap((builderRun) => {
        server = builderRun
        return builderRun.result
      }),
      shareReplay()
    )

  // watch mode
  if (options.watch) {
    const fileWatcherService = new FileWatcherService(options.watchDir)
    console.dir(options.watchDir)
    const progress$ = main$.pipe(
      switchMap(() => server?.progress ?? EMPTY),
      filter((progress) => progress.state === State.Stopped),
      map(() => null)
    )

    return main$.pipe(
      switchMap(() => merge(progress$, fileWatcherService.change())),
      switchMap((result: [string, Stats] | null ) => {
        const file = result?.[0]
          ? pathResolve(context.workspaceRoot, result[0])
          : void 0

        return playwrightService.run(file)
      })
    )
  }

  return main$.pipe(
    switchMap(() => playwrightService.run()),
    tap(() => (server?.stop(), playwrightService.destroy())),
    take(1),
  ).toPromise()
}

// create builder
export default createBuilder(playwrightBuilder)