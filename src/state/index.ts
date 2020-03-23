import { ReplaySubject, Observable } from 'rxjs'
import { model, State } from './model'
import { validate } from './validate'
import { filter, distinctUntilKeyChanged } from 'rxjs/operators'
import { propEq } from 'ramda'

export interface Intent<T = any> {
  type: string
  value?: T
}

export default class GameState {
  private intent$: ReplaySubject<Intent>
  private state$: Observable<State>
  private view$: Observable<Intent>

  constructor (customState: Partial<State> = {}) {
    this.intent$ = new ReplaySubject()
    this.state$ = model(this.intent$, customState)
    this.view$ = validate(this.state$, this.intent$)
  }

  emit (intent: Intent) {
    this.intent$.next(intent)
  }

  on (type: string, callback: (params: any) => void) {
    switch (type) {
      case 'state': {
        this.state$.subscribe(
          callback,
          (err) => console.error('Error found on state.on: ', err),
          () => console.log('state.on completed.')
        )
        break
      }
      case 'state-tiles': {
        this.state$.pipe(
          distinctUntilKeyChanged('tiles')
        ).subscribe(
          callback,
          (err) => console.error('Error found on state.tiles.on: ', err),
          () => console.log('state.tiles.on completed.')
        )
        break
      }
      case 'intent': {
        this.intent$.subscribe(
          callback,
          (err) => console.error(`Error found on intent: `, err),
          () => console.log(`intent completed.`)
        )
        break
      }
      default: {
        this.intent$.pipe(
          filter(propEq('type', type))
        ).subscribe(
          callback,
          (err) => console.error(`Error found on intent ${type}: `, err),
          () => console.log(`intent ${type} completed.`)
        )
        break
      }
    }
  }
}