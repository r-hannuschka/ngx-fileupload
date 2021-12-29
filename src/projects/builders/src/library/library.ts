import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect'
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

async function libraryBuilder(
  _options: unknown,
  context: BuilderContext,
): Promise<BuilderOutput> {

  const builder = await context.scheduleBuilder(
    '@angular-devkit/build-angular:ng-packagr',
    {
      tsConfig: "projects/core/tsconfig.lib.json",
      project: "projects/core/ng-package.json",
      watch: true
    }
  )

  const stream$ = new Subject<number>();
  const observ$ = stream$.asObservable();

  observ$.pipe(
  ).subscribe((x) => console.log(x))

  const builderOutput: BuilderOutput = {
    success: true
  }

  const result$ = await builder.progress;
  result$
    .pipe(
      tap((x) => console.log(x))
    )
    .subscribe((report: any) => console.log(report));

  return builderOutput;
}

// create builder
export default createBuilder(libraryBuilder)