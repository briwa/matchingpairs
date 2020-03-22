import { ReplaySubject, Observable } from 'rxjs'
import { model } from './model'
import { State } from './model'

export interface Intent<T = any> {
  type: string
  value?: T
}

export default class GameState {
  public static readonly INITIAL_STATE: State = {
    settings: {
      width: 0,
      height: 0,
      maxTilesCount: 0,
      closedTileValue: 'x'
    },
    lastOpenedTile: null,
    tiles: []
  }
  private input$: ReplaySubject<Intent>
  private state$: Observable<State>

  constructor (customState: Partial<State> = {}) {
    this.input$ = new ReplaySubject()
    this.state$ = model(this.input$, {
      ...GameState.INITIAL_STATE,
      ...customState
    })
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