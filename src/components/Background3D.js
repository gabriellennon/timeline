import { useEffect, useRef } from "react"
import * as THREE from "three"
import { useTheme } from "./ThemeProvider"

export default function Background3D() {
  const containerRef = useRef(null)
  const { theme } = useTheme()
  const sceneRef = useRef(null)
  const materialRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 30

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    // Create geometry
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 1500

    const posArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))

    // Create material
    const isDark = theme === "dark"
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      color: isDark ? 0x4a88ff : 0x0066ff,
      transparent: true,
      opacity: 0.6,
    })
    materialRef.current = particlesMaterial

    // Create mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)

      particlesMesh.rotation.x += 0.0005
      particlesMesh.rotation.y += 0.0005

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }

      // Dispose resources
      particlesGeometry.dispose()
      particlesMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  // Update material color when theme changes
  useEffect(() => {
    if (materialRef.current) {
      const isDark = theme === "dark"
      materialRef.current.color.set(isDark ? 0x4a88ff : 0x0066ff)
    }
  }, [theme])

  return <div ref={containerRef} className="fixed inset-0 -z-10" />
}
