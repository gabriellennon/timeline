import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "../../components/ThemeProvider"

function TimelineItem({
  item,
  left,
  width,
  lane,
  isDragging,
  isEditing,
  onDragStart,
  onNameEdit,
  onStartEdit,
  index,
  isLoaded,
}) {
  const [name, setName] = useState(item.name)
  const inputRef = useRef(null)
  const { theme } = useTheme()
  const [dragType, setDragType] = useState(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onNameEdit(name)
    }
  }

  const handleBlur = () => {
    onNameEdit(name)
  }

  // Generate a color based on the item id for variety
  const getItemColor = () => {
    const colors = [
      "from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700",
      "from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700",
      "from-green-500 to-green-600 dark:from-green-600 dark:to-green-700",
      "from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700",
      "from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700",
      "from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700",
    ]
    return colors[item.id % colors.length]
  }

  return (
    <motion.div
      className={`absolute rounded-md p-1 cursor-pointer select-none bg-gradient-to-r ${getItemColor()} shadow-md ${
        isDragging ? "z-10 opacity-90 shadow-lg" : ""
      }`}
      style={{
        left: `${left}%`,
        width: `${Math.max(width, 3)}%`, // Ensure minimum width for very short items
        top: `${lane * 40}px`,
        height: "36px",
        borderRadius: "4px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        color: "white",
        fontSize: "0.875rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      initial={isLoaded ? { opacity: 0, y: 20, scale: 0.9 } : false}
      animate={isLoaded ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        delay: 0.3 + index * 0.03,
        duration: 0.4,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
      onMouseDown={(e) => {
        // Determine if clicking on edges (for resize) or middle (for move)
        const rect = e.currentTarget.getBoundingClientRect()
        const offsetX = e.clientX - rect.left

        if (offsetX < 10) {
          onDragStart(item.id, "start")
          setDragType("start")
        } else if (offsetX > rect.width - 10) {
          onDragStart(item.id, "end")
          setDragType("end")
        } else {
          onDragStart(item.id, "move")
          setDragType("move")
        }
      }}
      onDoubleClick={onStartEdit}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full bg-transparent border-none outline-none text-white"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div className="px-1 truncate">{item.name}</div>
      )}

      {/* Resize handles with visual indicators */}
      <div
        className="absolute left-0 top-0 w-2 h-full cursor-w-resize hover:bg-white/20 transition-colors"
        style={{ opacity: isDragging && dragType === "start" ? 0.3 : 0 }}
      />
      <div
        className="absolute right-0 top-0 w-2 h-full cursor-e-resize hover:bg-white/20 transition-colors"
        style={{ opacity: isDragging && dragType === "end" ? 0.3 : 0 }}
      />
    </motion.div>
  )
}

export default TimelineItem
