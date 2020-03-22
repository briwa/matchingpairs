import { ReplaySubject, merge, Observable } from 'rxjs'
import { filter, map, scan, startWith, share } from 'rxjs/operators'

interface Intent<T = any> {
  type: string
  value: T
}

interface State {
  tiles: number[]
}

type Reducer = (state: State) => State

export default class GameState {
  public static generateTiles (width: number, height: number, maxTilesCount: number) {
    const tiles = []
    const allTiles = Array.from({length: maxTilesCount}, (v, i) => i)
    const maxUniqueTilesCount = width * height / 2

    if (maxTilesCount < maxUniqueTilesCount) {
      throw new Error(`Please provide a higher maxTilesCount for width: ${width} and height: ${height}.`
       + ` Minimum is ${maxUniqueTilesCount}.`)
    }

    while (allTiles.length > maxTilesCount - maxUniqueTilesCount) {
      let pairCount = 2
      const randomTileIdx = Math.floor(Math.random() * allTiles.length)
      const randomTile = allTiles[randomTileIdx]
      while (pairCount) {
        const randomShuffledIdx = Math.floor(Math.random() * tiles.length)
        tiles.splice(randomShuffledIdx, 0, { value: randomTile, opened: false })
        pairCount--
      }
      allTiles.splice(randomTileIdx, 1)
    }

    // TODO: Optimize this so that
    // the tiles can be grouped into rows while randomizing.
    const foo = tiles.reduce((total, value) => {
      const currentRow = total[total.length - 1]
      if (!currentRow || currentRow.length >= width) {
        total.push([value])
      } else {
        currentRow.push(value)
      }

      return total
    }, [])

    return foo
  }

  private input$: ReplaySubject<Intent>
  private state$: Observable<State>

  constructor () {
    this.input$ = new ReplaySubject()

    const createTileReducer$ = this.input$.pipe(
      filter((intent) => {
        return intent.type === 'init'
      }),
      map<Intent, Reducer>((intent) => function createTileReducer (state) {

        return {
          ...state,
          tiles: GameState.generateTiles(
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