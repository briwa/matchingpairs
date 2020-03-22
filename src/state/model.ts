import { merge, Observable } from 'rxjs'
import { filter, map, mapTo, scan, startWith, share } from 'rxjs/operators'
import { assocPath } from 'ramda'

import { generateTiles } from './helpers'
import { Intent } from './index'

export interface State {
  settings: {
    width: number
    height: number
    maxTilesCount: number
    closedTileValue: string | number
  }
  lastOpenedTile: {
    x: number,
    y: number
  } | null
  tiles: { opened: boolean, value: number }[][]
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

  const updateSettingsReducer$ = intent$.pipe(
    filter((intent) => intent.type === 'update-settings'),
    map<Intent<Partial<State['settings']>>, Reducer>((intent) => function updateSettingsReducer (state) {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...intent.value
        }
      }
    })
  )

  const openTileReducer$ = intent$.pipe(
    filter((intent) => intent.type === 'toggle-tile'),
    map<Intent<{ x: number, y: number}>, Reducer>((intent) => function openTileReducer (state) {
      const tile = state.tiles[intent.value.x][intent.value.y]

      return {
        ...state,
        tiles: assocPath([intent.value.x, intent.value.y], { value: tile.value, opened: !tile.opened }, state.tiles)
      }
    })
  )

  return merge(
    createTileReducer$,
    updateSettingsReducer$,
    openTileReducer$
  ).pipe(
    startWith(initialState),
    scan<Reducer, State>((state, reducer) => reducer(state)),
    share()
  )
}
