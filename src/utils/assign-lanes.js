import { parse } from "date-fns"

export function assignLanes(items){
  // Sort items by start date
  const sortedItems = [...items].sort((a, b) => {
    const aStart = parse(a.start, "yyyy-MM-dd", new Date())
    const bStart = parse(b.start, "yyyy-MM-dd", new Date())
    return aStart.getTime() - bStart.getTime()
  })

  const itemsWithLanes = []

  // Assign lanes to each item
  sortedItems.forEach((item) => {
    const itemStart = parse(item.start, "yyyy-MM-dd", new Date())
    const itemEnd = parse(item.end, "yyyy-MM-dd", new Date())

    // Find the first available lane
    let lane = 0
    let foundLane = false

    while (!foundLane) {
      // Check if this lane is available for the current item
      const laneAvailable = itemsWithLanes.every((existingItem) => {
        if (existingItem.lane !== lane) return true

        const existingStart = parse(existingItem.start, "yyyy-MM-dd", new Date())
        const existingEnd = parse(existingItem.end, "yyyy-MM-dd", new Date())

        // Check if items overlap
        return itemEnd < existingStart || itemStart > existingEnd
      })

      if (laneAvailable) {
        foundLane = true
      } else {
        lane++
      }
    }

    itemsWithLanes.push({ ...item, lane })
  })

  return itemsWithLanes
}
