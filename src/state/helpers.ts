export function generateTiles (width: number, height: number, maxTilesCount: number) {
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
      tiles.splice(randomShuffledIdx, 0, {
        value: randomTile,
        side: --pairCount
      })
    }
    allTiles.splice(randomTileIdx, 1)
  }

  // TODO: Optimize this so that
  // the tiles can be grouped into rows while randomizing.
  return tiles.reduce((acc, { side, value }) => {
    const { list, dict } = acc
    const tile = {
      value,
      side,
      opened: false,
      x: 0,
      y: 0
    }

    const currentRow = list[list.length - 1] || []
    if (!currentRow.length || currentRow.length >= width) {
      list.push([tile])
    } else {
      currentRow.push(tile)
    }

    tile.x = currentRow.length - 1
    tile.y = list.length - 1

    if (!dict[tile.value]) {
      dict[tile.value] = {}
    }

    dict[tile.value][tile.side] = tile

    return acc
  }, { list: [], dict: {} })
}
