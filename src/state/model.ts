import { merge, Observable } from 'rxjs'
import { filter, mapTo, scan, startWith, share } from 'rxjs/operators'
import { generateTiles } from './helpers'
import { Intent } from './index'

export interface State {
  settings: {
    width: number
    height: number
    maxTilesCount: number
    closedTileValue: string | number
  }
  tiles: number[]
}

type Reducer = (state: State) => State

export function model (intent$: Observable<Intent>, initialState: State) {
  const createTileReducer$ = intent$.pipe(
    filter((intent) => intent.type === 'generate-tiles'),
    mapTo<Intent, Reducer>(function createTileReducer (state) {
      const { width, height, maxTilesCount } = state.settings

      return {
        ...state,
        tiles: generateTiles(width, height, maxTilesCount)
      }
    })
  )

  return merge(
    createTileReducer$
  ).pipe(
    startWith(initialState),
    scan<Reducer, State>((state, reducer) => reducer(state)),
    share()
  )
}
