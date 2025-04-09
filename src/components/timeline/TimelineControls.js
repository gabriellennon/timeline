import Slider from "../ui/Slider"
import Button from "../ui/Button"
import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"

function TimelineControls({ zoom, onZoomChange }) {
  return (
    <motion.div
      className="flex items-center gap-4 mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.25))}
            aria-label="Zoom out"
            className="transition-all hover:shadow-md"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </motion.div>

        <Slider
          value={[zoom]}
          min={0.5}
          max={3}
          step={0.1}
          className="w-32"
          onValueChange={(value) => onZoomChange(value[0])}
        />

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onZoomChange(Math.min(3, zoom + 0.25))}
            aria-label="Zoom in"
            className="transition-all hover:shadow-md"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      <div className="text-sm text-muted-foreground">{Math.round(zoom * 100)}%</div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="ml-auto">
        <Button variant="outline" size="sm" onClick={() => onZoomChange(1)} className="transition-all hover:shadow-md">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Zoom
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default TimelineControls
