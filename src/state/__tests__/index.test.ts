import GameState from '../index'
import { TestScheduler } from 'rxjs/testing'
import { ReplaySubject } from 'rxjs'

const mockedTiles = [
  [{ value: 1, opened: false }, { value: 2, opened: false }],
  [{ value: 2, opened: false }, { value: 1, opened: false }]
]

jest.mock('../helpers', () => {
  return {
    generateTiles: () => mockedTiles
  }
})

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected)
});

describe('Game state', () => {
  test('Should work', () => {    
    testScheduler.run((helpers) => {
      const initialState = {
        settings: { width: 2, height: 2, maxTilesCount: 5, closedTileValue: 'x' },
        tiles: []
      }

      const state = new GameState(initialState)
      const input = {
        a: {
          type: 'generate-tiles'
        }
      }
      const output = {
        o: {
          settings: initialState.settings,
          tiles: []
        },
        a: {
          settings: initialState.settings,
          tiles: mockedTiles
        }
      }

      const inputMarbles  = '---a---'
      const outputMarbles = 'o--a---'

      const input$ = helpers.hot(inputMarbles, input)
      input$.subscribe((intent) => state.emit(intent))
      
      // This is a replay subject because it needs to remember
      // the first value that is given.
      const output$ = new ReplaySubject()
      state.on((value) => output$.next(value))

      helpers.expectObservable(output$).toBe(outputMarbles, output)
    })
  })
})
