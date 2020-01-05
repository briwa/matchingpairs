export default class MainLevel {
  public openedTileIndices: number[][] = [[]]
  private size: number
  private tiles: number[]

  constructor (size) {
    this.size = size
  }

  create () {
    this.tiles = []

    const allTilesCount = 45
    const allTiles = Array.from({length: allTilesCount}, (v, i) => i)
    const maxUniqueTilesCount = this.size * 2

    // TODO: Still not that random...
    while (allTiles.length > allTilesCount - maxUniqueTilesCount) {
      let pairCount = 2
      const randomTileIdx = Math.floor(Math.random() * allTiles.length)
      const randomTile = allTiles[randomTileIdx]
      while (pairCount) {
        const randomShuffledIdx = Math.floor(Math.random() * this.tiles.length)
        this.tiles.splice(randomShuffledIdx, 0, randomTile)
        pairCount--
      }
      allTiles.splice(randomTileIdx, 1)
    }

    return this.tiles
  }

  reset () {
    this.openedTileIndices = [[]]
  }

  toggleTile (tileIdx: number) {
    const lastopenedTileIndices = this.openedTileIndices[this.openedTileIndices.length - 1]
    const lastOpened = {
      idx: lastopenedTileIndices[0],
      tile: this.tiles[lastopenedTileIndices[0]]
    }
    const current = {
      idx: tileIdx,
      tile: this.tiles[tileIdx],
      shouldOpen: lastOpened.idx !== tileIdx
    }

    const isPaired = typeof lastOpened.tile !== 'undefined'
      && current.shouldOpen
      && lastOpened.tile === current.tile

    if (!lastopenedTileIndices.length) {
      lastopenedTileIndices.push(current.idx)
    } else {
      if (isPaired) {
        lastopenedTileIndices.push(current.idx)
        this.openedTileIndices.push([])
      } else {
        lastopenedTileIndices.pop()
      }
    }

    return {
      current,
      lastOpened,
      isPaired
    }
  }
}