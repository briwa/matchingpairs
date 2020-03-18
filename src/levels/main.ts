interface Tile {
  idx: number
  tile: number
}

export default class LevelMain {
  public openedTiles: { idx: number, tile: number }[][] = [[]]
  private tiles: number[]

  constructor (tiles: number[]) {
    if (tiles.length % 2 !== 0) {
      throw new Error('An array with an even length is required.')
    }

    this.tiles = tiles
  }

  toggle (tileIdx: number): { current: Tile, shouldOpen: boolean, lastOpened?: Tile, isPaired?: boolean } {
    const lastopenedTiles = this.openedTiles[this.openedTiles.length - 1]
    const lastOpened = lastopenedTiles[0]
    const current = {
      idx: tileIdx,
      tile: this.tiles[tileIdx]
    }

    let shouldOpen = true

    if (!lastOpened) {
      lastopenedTiles.push(current)

      return { current, shouldOpen }
    }

    shouldOpen = current.idx !== lastOpened.idx
    const isPaired = shouldOpen && lastOpened.tile === current.tile

    if (current.idx !== lastOpened.idx && lastOpened.tile === current.tile) {
      lastopenedTiles.push(current)
      this.openedTiles.push([])
    } else {
      lastopenedTiles.pop()
    }

    return {
      current,
      shouldOpen,
      lastOpened,
      isPaired
    }
  }
}