import { merge, Observable, BehaviorSubject } from 'rxjs'
import { filter, map, mapTo, scan, startWith, publishReplay, refCount } from 'rxjs/operators'
import { assocPath, propEq, append, remove } from 'ramda'

import { generateTiles } from './helpers'
import { Intent } from './index'

interface Tile {
  value: number
  x: number
  y: number
}

export interface State {
  settings: {
    width: number
    height: number
    maxTilesCount: number
    closedTileValue: string | number
  }
  tiles: number[][]
  openedTiles: Tile[][]
}

type Reducer = (state: State) => State

export const INITIAL_STATE: State = {
  settings: {
    width: 0,
    height: 0,
    maxTilesCount: 0,
    closedTileValue: 'x'
  },
  tiles: [],
  openedTiles: [[]]
}

export function model (intent$: Observable<Intent>, customState: Partial<State>) {
  const createTileReducer$ = intent$.pipe(
    filter(propEq('type', 'generate-tiles')),
    mapTo<Intent, Reducer>(function createTileReducer (state) {
      const { width, height, maxTilesCount } = state.settings

      return {
        ...state,
        tiles: generateTiles(width, height, maxTilesCount)
      }
    })
  )

  const updateSettingsReducer$ = intent$.pipe(
    filter(propEq('type', 'update-settings')),
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
    filter(propEq('type', 'open-tile')),
    map<Intent<{ x: number, y: number}>, Reducer>((intent) => function openTileReducer (state) {
      const tileNumber = state.tiles[intent.value.y][intent.value.x]
      const tile = {
        value: tileNumber,
        x: intent.value.x,
        y: intent.value.y
      }

      const lastOpenedPair = state.openedTiles[state.openedTiles.length - 1]
      if (lastOpenedPair && lastOpenedPair.length === 2) {
        return {
          ...state,
          openedTiles: append([tile], state.openedTiles)
        }
      }

      return {
        ...state,
        openedTiles: assocPath(
          [state.openedTiles.length - 1],
          append(tile, state.openedTiles[state.openedTiles.length - 1]),
          state.openedTiles
        )
      }
    })
  )

  const closeLastTileReducer$ = intent$.pipe(
    filter(propEq('type', 'close-last-tiles')),
    mapTo<Intent, Reducer>(function closeLastTileReducer (state) {
      return {
        ...state,
        openedTiles: remove(-1, 1, state.openedTiles)
      }
    })
  )

  return merge(
    createTileReducer$,
    updateSettingsReducer$,
    openTileReducer$,
    closeLastTileReducer$
  ).pipe(
    startWith({
      ...INITIAL_STATE,
      ...customState
    }),
    scan<Reducer, State>((state, reducer) => reducer(state)),
    // Publish replay and refcount is needed
    // to remember the last value and allow multicasts
    publishReplay(1),
    refCount()
  )
}
