import { BuilderOutput, createBuilder, BuilderContext, targetFromTargetString } from '@angular-devkit/architect'
import { spawn } from 'child_process';
import { lastValueFrom, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

interface PLAYWRIGHT_BUILDER_OPTIONS {
  devServerTarget: string
  config: string
}

async function playwrightBuilder(
  options: PLAYWRIGHT_BUILDER_OPTIONS,
  context: BuilderContext
): Promise<BuilderOutput> {
  context.logger.info('start dev server')

  //start dev server
  const target = targetFromTargetString(options.devServerTarget)
  const server = await context.scheduleTarget(target)
  const serverResult = await server.result

  if (!serverResult.success) {
    return serverResult
  }

  const playwrightCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx'
  const playwrightArgs: string[] = ['playwright', 'test', '--config=e2e/playwright.conf.ts']
  const playwrightResult = new Subject<BuilderOutput>()
  const playwrightProcess = spawn(playwrightCommand, playwrightArgs, {
    stdio: 'inherit'
  })

  playwrightProcess.on('exit', async () => {
    playwrightResult.next({ success: true, error: '' })
    playwrightResult.complete()
  })

  playwrightProcess.on('error', (error) => {
    playwrightResult.next({ success: false, error: error.message })
    playwrightResult.complete()
  })

  playwrightResult.pipe(finalize(async () => await server.stop()))
  return lastValueFrom(playwrightResult);
}

// create builder
export default createBuilder(playwrightBuilder)