import { Observable, ReplaySubject, merge } from 'rxjs'
import { State } from './model'
import { Intent } from './index'
import { withLatestFrom, filter, map } from 'rxjs/operators'
import { propEq } from 'ramda'

export function validate (state$: Observable<State>, input$: ReplaySubject<Intent>) {
  const closeLast$ = input$.pipe(
    filter(propEq('type', 'open-tile')),
    withLatestFrom(state$),
    map(([_, state]) => state.openedTiles[state.openedTiles.length - 1]),
    filter((pair) => {
      return pair.length === 2
        && !(pair[0].value === pair[1].value
        && pair[0].x !== pair[1].x
        && pair[0].y !== pair[1].y)
    }),
    map((pair) => ({
      type: 'close-last-tiles',
      value: pair[0].value === pair[1].value
        ? [pair[0]]
        : pair
    }))
  )

  merge(
    closeLast$
  ).subscribe(
    (intent) => input$.next(intent),
    (err) => console.error('Error found on state validate: ', err),
    () => console.log('state validate completed.')
  )
}

