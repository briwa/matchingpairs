import { TestScheduler } from 'rxjs/testing'
import { ReplaySubject } from 'rxjs'

import GameState from '../index'
import { INITIAL_STATE } from '../model'

const mockedTiles = [[1, 2], [2, 1]]
jest.mock('../helpers', () => {
  return {
    generateTiles: () => mockedTiles
  }
})

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected)
})

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
          type: 'open-tile',
          value: {
            x: 0,
            y: 1
          }
        },
        d: {
          type: 'open-tile',
          value: {
            x: 1,
            y: 1
          }
        }
      }

      const output = {
        o: INITIAL_STATE,
        a: {
          settings: {
            width: 2,
            height: 2,
            maxTilesCount: 10,
            closedTileValue: '?'
          },
          tiles: INITIAL_STATE.tiles,
          openedTiles: INITIAL_STATE.openedTiles
        },
        b: {
          settings: {
            width: 2,
            height: 2,
            maxTilesCount: 10,
            closedTileValue: '?'
          },
          tiles: mockedTiles,
          openedTiles: INITIAL_STATE.openedTiles
        },
        c: {
          settings: {
            width: 2,
            height: 2,
            maxTilesCount: 10,
            closedTileValue: '?'
          },
          tiles: mockedTiles,
          openedTiles: [
            [{ x: 0, y: 1, value: 2 }]
          ]
        },
        d: {
          settings: {
            width: 2,
            height: 2,
            maxTilesCount: 10,
            closedTileValue: '?'
          },
          tiles: mockedTiles,
          openedTiles: [
            [{ x: 0, y: 1, value: 2 }, { x: 1, y: 1, value: 1 }]
          ]
        },
        e: {
          settings: {
            width: 2,
            height: 2,
            maxTilesCount: 10,
            closedTileValue: '?'
          },
          tiles: mockedTiles,
          openedTiles: []
        }
      }

      const inputMarbles  = '--a-b-c-d--'
      const outputMarbles = 'o-a-b-c-(de)--'

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
