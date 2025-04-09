import { useState, useRef, useEffect } from "react"
import { format, parse, differenceInDays, addDays } from "date-fns"
import { assignLanes } from "../../utils/assign-lanes"
import TimelineItem from "./TimelineItem"
import TimelineControls from "./TimelineControls"
import { motion } from "framer-motion"

function Timeline({ items }) {
  const [zoom, setZoom] = useState(1)
  const [draggingItem, setDraggingItem] = useState(null)
  const [dragType, setDragType] = useState(null)
  const [timelineItems, setTimelineItems] = useState(items)
  const [editingItem, setEditingItem] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const timelineRef = useRef(null)

  // Find the earliest start date and latest end date
  const startDates = timelineItems.map((item) => parse(item.start, "yyyy-MM-dd", new Date()))
  const endDates = timelineItems.map((item) => parse(item.end, "yyyy-MM-dd", new Date()))
  const earliestDate = startDates.reduce((earliest, date) => (date < earliest ? date : earliest), startDates[0])
  const latestDate = endDates.reduce((latest, date) => (date > latest ? date : latest), endDates[0])

  // Calculate total days in timeline
  const totalDays = differenceInDays(latestDate, earliestDate) + 1

  // Assign lanes to items
  const itemsWithLanes = assignLanes(timelineItems)
  const maxLane = Math.max(...itemsWithLanes.map((item) => item.lane || 0))

  // Set loaded state after initial render
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Handle zooming
  const handleZoomChange = (newZoom) => {
    setZoom(newZoom)
  }

  // Handle drag start
  const handleDragStart = (id, type) => {
    setDraggingItem(id)
    setDragType(type)
  }

  // Handle drag end
  const handleDragEnd = () => {
    setDraggingItem(null)
    setDragType(null)
  }

  // Handle drag move
  const handleDragMove = (e, id) => {
    if (draggingItem !== id || !dragType || !timelineRef.current) return

    const timelineRect = timelineRef.current.getBoundingClientRect()
    const dayWidth = (timelineRect.width / totalDays) * zoom
    const offsetX = e.clientX - timelineRect.left
    const dayOffset = Math.floor(offsetX / dayWidth)

    const newDate = addDays(earliestDate, dayOffset)
    const formattedDate = format(newDate, "yyyy-MM-dd")

    setTimelineItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          if (dragType === "start") {
            // Don't allow start date to be after end date
            const endDate = parse(item.end, "yyyy-MM-dd", new Date())
            if (newDate > endDate) return item
            return { ...item, start: formattedDate }
          } else if (dragType === "end") {
            // Don't allow end date to be before start date
            const startDate = parse(item.start, "yyyy-MM-dd", new Date())
            if (newDate < startDate) return item
            return { ...item, end: formattedDate }
          } else if (dragType === "move") {
            const itemStartDate = parse(item.start, "yyyy-MM-dd", new Date())
            const itemEndDate = parse(item.end, "yyyy-MM-dd", new Date())
            const duration = differenceInDays(itemEndDate, itemStartDate)

            const newStartDate = newDate
            const newEndDate = addDays(newStartDate, duration)

            return {
              ...item,
              start: format(newStartDate, "yyyy-MM-dd"),
              end: format(newEndDate, "yyyy-MM-dd"),
            }
          }
        }
        return item
      }),
    )
  }

  // Handle item name edit
  const handleNameEdit = (id, newName) => {
    setTimelineItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, name: newName } : item)))
    setEditingItem(null)
  }

  // Generate month labels
  const generateMonthLabels = () => {
    const months = []
    const currentDate = new Date(earliestDate)
    let currentMonth = currentDate.getMonth()

    for (let day = 0; day <= totalDays; day++) {
      const date = addDays(earliestDate, day)
      if (date.getMonth() !== currentMonth || day === 0) {
        currentMonth = date.getMonth()
        months.push({
          label: format(date, "MMM yyyy"),
          position: (day / totalDays) * 100,
        })
      }
    }

    return months
  }

  const monthLabels = generateMonthLabels()

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TimelineControls zoom={zoom} onZoomChange={handleZoomChange} />

      <div className="relative mt-4 mb-8">
        {/* Month labels */}
        <motion.div
          className="relative h-8 border-b border-gray-300 dark:border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {monthLabels.map((month, index) => (
            <motion.div
              key={index}
              className="absolute top-0 text-xs font-medium"
              style={{
                left: `${month.position}%`,
                transform: "translateX(-50%)",
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
            >
              {month.label}
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline grid */}
        <motion.div
          ref={timelineRef}
          className="relative border border-gray-200 dark:border-gray-700 rounded-md overflow-x-auto bg-background/50 backdrop-blur-sm"
          style={{
            width: "100%",
            overflowX: "auto",
            minHeight: `${(maxLane + 1) * 40}px`,
          }}
          onMouseMove={(e) => {
            if (draggingItem !== null) {
              handleDragMove(e, draggingItem)
            }
          }}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div
            className="relative"
            style={{
              width: `${totalDays * 20 * zoom}px`,
              minHeight: `${(maxLane + 1) * 40}px`,
            }}
          >
            {/* Day grid lines */}
            {Array.from({ length: totalDays + 1 }).map((_, index) => (
              <div
                key={index}
                className="absolute top-0 bottom-0 border-l border-gray-100 dark:border-gray-800"
                style={{
                  left: `${(index / totalDays) * 100}%`,
                  height: "100%",
                }}
              />
            ))}

            {/* Timeline items */}
            {itemsWithLanes.map((item, idx) => {
              const startDate = parse(item.start, "yyyy-MM-dd", new Date())
              const endDate = parse(item.end, "yyyy-MM-dd", new Date())
              const startOffset = differenceInDays(startDate, earliestDate)
              const duration = differenceInDays(endDate, startDate) + 1

              const left = (startOffset / totalDays) * 100
              const width = (duration / totalDays) * 100

              return (
                <TimelineItem
                  key={item.id}
                  item={item}
                  left={left}
                  width={width}
                  lane={item.lane || 0}
                  isDragging={draggingItem === item.id}
                  isEditing={editingItem === item.id}
                  onDragStart={handleDragStart}
                  onNameEdit={(newName) => handleNameEdit(item.id, newName)}
                  onStartEdit={() => setEditingItem(item.id)}
                  index={idx}
                  isLoaded={isLoaded}
                />
              )
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Timeline
