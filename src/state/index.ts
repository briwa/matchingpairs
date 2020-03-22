import { ReplaySubject, merge, Observable } from 'rxjs'
import { filter, map, scan, startWith, share } from 'rxjs/operators'
import { generateTiles } from './helpers'

interface Intent<T = any> {
  type: string
  value: T
}

interface State {
  tiles: number[]
}

type Reducer = (state: State) => State

export default class GameState {
  private input$: ReplaySubject<Intent>
  private state$: Observable<State>

  constructor () {
    this.input$ = new ReplaySubject()

    const createTileReducer$ = this.input$.pipe(
      filter((intent) => intent.type === 'init'),
      map<Intent, Reducer>((intent) => function createTileReducer (state) {

        return {
          ...state,
          tiles: generateTiles(
            intent.value.width,
            intent.value.height,
            intent.value.maxTilesCount
          )
        }
      })
    )

    this.state$ = merge(
      createTileReducer$
    ).pipe(
      startWith({ tiles: [] }),
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