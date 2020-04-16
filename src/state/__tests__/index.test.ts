import { TestScheduler } from 'rxjs/testing'
import { ReplaySubject, Observable } from 'rxjs'

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
  test('Should work', (done) => {
    testScheduler.run((helpers) => {
      const state = new GameState()
      const intentValues = {
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
        },
        e: {
          type: 'close-last-tiles',
          value: [
            { x: 0, y: 1, value: 2 },
            { x: 1, y: 1, value: 1 }
          ]
        },
        f: {
          type: 'disable-input',
          value: [{ x: 0, y: 1, value: 2 }, { x: 1, y: 1, value: 1 }]
        },
        g: {
          type: 'enable-input',
          value: [{ x: 0, y: 1, value: 2 }, { x: 1, y: 1, value: 1 }]
        }
      }

      const outputStateValues = {
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

      const input          = '--a-b-c-d---------'
      const outputState    = 'o-a-b-c-d 1999ms e'
      const observedIntent = '--a-b-c-(fd) 1996ms (eg)'

      const input$: Observable<{ type: string, value?: any }> = helpers.hot(input, intentValues)
      input$.subscribe((intent) => state.emit(intent.type, intent.value))

      // This is a replay subject because it needs to remember
      // the first value that is given.
      const outputState$ = new ReplaySubject()
      state.on('state', (value) => outputState$.next(value))

      const observedIntent$ = new ReplaySubject()
      state.on('intent', (value) => observedIntent$.next(value))

      helpers.expectObservable(outputState$).toBe(outputState, outputStateValues)
      helpers.expectObservable(observedIntent$).toBe(observedIntent, intentValues)
      done()
    })
  })
})
