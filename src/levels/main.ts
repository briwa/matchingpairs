interface Tile {
  idx: number
  tile: number
}

export default class MainLevel {
  public openedTiles: { idx: number, tile: number }[][]
  private size: number
  private allTilesCount
  private tiles: number[]

  constructor ({ size, allTilesCount }) {
    this.size = size
    this.allTilesCount = allTilesCount
  }

  create () {
    this.openedTiles = [[]]
    this.tiles = []

    const allTiles = Array.from({length: this.allTilesCount}, (v, i) => i)
    const maxUniqueTilesCount = Math.pow(this.size, 2) / 2

    while (allTiles.length > this.allTilesCount - maxUniqueTilesCount) {
      let pairCount = 2
      const randomTileIdx = Math.floor(Math.random() * allTiles.length - 1)
      const randomTile = allTiles[randomTileIdx]
      while (pairCount) {
        const randomShuffledIdx = Math.floor(Math.random() * this.tiles.length - 1)
        this.tiles.splice(randomShuffledIdx, 0, randomTile)
        pairCount--
      }
      allTiles.splice(randomTileIdx, 1)
    }

    return this.tiles
  }

  toggleTile (tileIdx: number): { current: Tile, shouldOpen: boolean, lastOpened?: Tile, isPaired?: boolean } {
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