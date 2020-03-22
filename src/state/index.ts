import { ReplaySubject, Observable } from 'rxjs'
import { model } from './model'
import { State } from './model'
import { validate } from './validate'

export interface Intent<T = any> {
  type: string
  value?: T
}

export default class GameState {
  private input$: ReplaySubject<Intent>
  private state$: Observable<State>

  constructor (customState: Partial<State> = {}) {
    this.input$ = new ReplaySubject()
    this.state$ = model(this.input$, customState)

    validate(this.state$, this.input$)
  }

  emit (intent: Intent) {
    this.input$.next(intent)
  }

  on (callback: (state: State) => void) {
    this.state$.subscribe(
      callback,
      (err) => console.error('Error found on state.on: ', err),
      () => console.log('state.on completed.')
    )
  }
}