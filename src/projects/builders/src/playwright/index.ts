import { BuilderOutput, createBuilder, BuilderContext, targetFromTargetString } from '@angular-devkit/architect'
import { State } from '@angular-devkit/architect/src/progress-schema';
import { from, Observable, merge } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { FileWatcherService } from './utils/file-watcher';
import { PlaywrightService } from './utils/playwright';

interface PLAYWRIGHT_BUILDER_OPTIONS {
  devServerTarget: string
  config: string
}

function playwrightBuilder(
  options: PLAYWRIGHT_BUILDER_OPTIONS,
  context: BuilderContext
): Observable<BuilderOutput> {
  //start dev server
  const fileWatcherService = new FileWatcherService('./e2e')
  const playwrightService = new PlaywrightService()

  const target = targetFromTargetString(options.devServerTarget)
  const server$ = from(context.scheduleTarget(target))

  // progress stream from dev server builder
  const progress$ = server$.pipe(
    switchMap((server) => server.progress),
    filter((progress) => progress.state === State.Stopped),
  )

  return server$.pipe(
    // get notified one time if server is running
    switchMap((server) => server.result),
    // switch to changes on progress or test files
    switchMap(() => merge(progress$, fileWatcherService.change())),
    // run playwright
    switchMap(() => playwrightService.run())
  )
}

// create builder
export default createBuilder(playwrightBuilder)