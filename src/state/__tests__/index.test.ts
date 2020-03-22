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
      const state = new GameState()
      const input = {
        a: {
          type: 'update-settings',
          value: {
            width: 2,
            height: 2,
            maxTilesCount: 10,
            closedTileValue: '?'
          }
        },
        b: {
          type: 'generate-tiles'
        },
        c: {
          type: 'toggle-tile',
          value: {
            x: 0,
            y: 1
          }
        }
      }

      const output = {
        o: GameState.INITIAL_STATE,
        a: {
          settings: {
            width: 2,
            height: 2,
            maxTilesCount: 10,
            closedTileValue: '?'
          },
          lastOpenedTile: null,
          tiles: []
        },
        b: {
          settings: {
            width: 2,
            height: 2,
            maxTilesCount: 10,
            closedTileValue: '?'
          },
          lastOpenedTile: null,
          tiles: mockedTiles
        },
        c: {
          settings: {
            width: 2,
            height: 2,
            maxTilesCount: 10,
            closedTileValue: '?'
          },
          lastOpenedTile: null,
          tiles: [
            [{ value: 1, opened: false }, { value: 2, opened: true }],
            [{ value: 2, opened: false }, { value: 1, opened: false }]
          ],
        }
      }

      const inputMarbles  = '--a-b-c'
      const outputMarbles = 'o-a-b-c'

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
