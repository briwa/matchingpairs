import { ReplaySubject, merge, Observable } from 'rxjs'
import { filter, mapTo, scan, startWith, share } from 'rxjs/operators'
import { generateTiles } from './helpers'

interface Intent<T = any> {
  type: string
  value?: T
}

interface State {
  settings: {
    width: number
    height: number
    maxTilesCount: number
    closedTileValue: string | number
  }
  tiles: number[]
}

type Reducer = (state: State) => State

export default class GameState {
  public static readonly INITIAL_STATE: State = {
    settings: {
      width: 0,
      height: 0,
      maxTilesCount: 0,
      closedTileValue: 'x'
    },
    tiles: []
  }
  private input$: ReplaySubject<Intent>
  private state$: Observable<State>

  constructor (initialState: Partial<State> = {}) {
    this.input$ = new ReplaySubject()

    const createTileReducer$ = this.input$.pipe(
      filter((intent) => intent.type === 'generate-tiles'),
      mapTo<Intent, Reducer>(function createTileReducer (state) {
        const { width, height, maxTilesCount } = state.settings

        return {
          ...state,
          tiles: generateTiles(width, height, maxTilesCount)
        }
      })
    )

    this.state$ = merge(
      createTileReducer$
    ).pipe(
      startWith({ ...GameState.INITIAL_STATE, ...initialState }),
      scan<Reducer, State>((state, reducer) => reducer(state)),
      share()
    )
  }

  emit (intent: Intent) {
    this.input$.next(intent)
  }

  on (callback: (state: State) => void) {
    this.state$.subscribe(
      callback,
      console.error,
      () => console.log('completed')
    )
  }
}