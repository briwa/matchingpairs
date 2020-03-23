import { Observable, ReplaySubject, merge, partition } from 'rxjs'
import { State } from './model'
import { Intent } from './index'
import { withLatestFrom, filter, map, delay } from 'rxjs/operators'
import { propEq } from 'ramda'

export function validate (state$: Observable<State>, intent$: ReplaySubject<Intent>) {
  const pairTile$ = intent$.pipe(
    filter(propEq('type', 'open-tile')),
    withLatestFrom(state$),
    map(([_, state]) => state.openedTiles[state.openedTiles.length - 1]),
    filter((pair) => {
      return pair.length === 2
        && !(pair[0].value === pair[1].value
        && pair[0].x !== pair[1].x
        && pair[0].y !== pair[1].y)
    })
  )

  const [samePair$, differentPair$] = partition(pairTile$, (pair) => pair[0].value === pair[1].value)

  const closeOne$ = samePair$.pipe(
    map((pair) => ({
      type: 'close-last-tiles',
      value: [pair[0]]
    }))
  )

  const disableInput$ = differentPair$.pipe(
    map((pair) => ({
      type: 'disable-input',
      value: pair
    }))
  )

  const delayedIntent$ = differentPair$.pipe(delay(2000))
  const closeBoth$ = delayedIntent$.pipe(
    map((pair) => ({
      type: 'close-last-tiles',
      value: pair
    }))
  )
  const enableInput$ = delayedIntent$.pipe(
    map((pair) => ({
      type: 'enable-input',
      value: pair
    }))
  )

  return merge(
    closeOne$,
    disableInput$,
    closeBoth$,
    enableInput$
  )
}

