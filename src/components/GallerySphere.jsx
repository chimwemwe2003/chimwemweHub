import { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Text } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Generate Fibonacci sphere distribution for optimal image placement
function generateFibonacciSphere(count, radius = 5) {
  const points = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle in radians

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
    const radius_at_y = Math.sqrt(1 - y * y); // Radius at y
    const theta = goldenAngle * i; // Golden angle increment

    const x = Math.cos(theta) * radius_at_y;
    const z = Math.sin(theta) * radius_at_y;

    points.push({
      position: [x * radius, y * radius, z * radius],
      index: i,
    });
  }

  return points;
}

// Image sphere component
function ImageSphere({ images, onImageClick, groupRef, momentumRef, isDraggingRef, autoRotateRef }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const rotationSpeedRef = useRef(0.005);

  // Generate sphere points
  const spherePoints = useMemo(
    () => generateFibonacciSphere(images.length, 5),
    [images.length]
  );

  // Auto-rotation and momentum
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (autoRotateRef.current && !isDraggingRef.current) {
      groupRef.current.rotation.y += rotationSpeedRef.current;
    }

    // Apply momentum
    if (Math.abs(momentumRef.current.x) > 0.001 || Math.abs(momentumRef.current.y) > 0.001) {
      groupRef.current.rotation.y += momentumRef.current.x * 0.01;
      groupRef.current.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, groupRef.current.rotation.x + momentumRef.current.y * 0.01)
      );

      // Damping
      momentumRef.current.x *= 0.95;
      momentumRef.current.y *= 0.95;
    }

    // Decay momentum
    if (Math.abs(momentumRef.current.x) < 0.001) momentumRef.current.x = 0;
    if (Math.abs(momentumRef.current.y) < 0.001) momentumRef.current.y = 0;
  });

  return (
    <group ref={groupRef}>
      {spherePoints.map((point, index) => {
        const image = images[index];
        if (!image) return null;

        return (
          <ImageBillboard
            key={index}
            position={point.position}
            imageUrl={image.url}
            title={image.title || `Image ${index + 1}`}
            index={index}
            hovered={hoveredIndex === index}
            onHover={() => setHoveredIndex(index)}
            onUnhover={() => setHoveredIndex(null)}
            onClick={() => onImageClick(index)}
          />
        );
      })}
    </group>
  );
}

// Individual image billboard component
function ImageBillboard({ position, imageUrl, title, index, hovered, onHover, onUnhover, onClick }) {
  const meshRef = useRef();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Always face camera
  useFrame(({ camera }) => {
    if (meshRef.current) {
      meshRef.current.lookAt(camera.position);
    }
  });

  // Load image texture
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(
      imageUrl,
      () => setImageLoaded(true),
      undefined,
      (err) => console.error("Error loading image:", err)
    );
    return tex;
  }, [imageUrl]);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={onHover}
        onPointerLeave={onUnhover}
        onClick={onClick}
        scale={hovered ? [1.2, 1.2, 1] : [1, 1, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={imageLoaded ? 1 : 0}
          emissive={hovered ? "#22d3ee" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      {hovered && (
        <Text
          position={[0, -0.7, 0]}
          fontSize={0.2}
          color="#22d3ee"
          anchorX="center"
          anchorY="middle"
        >
          {title}
        </Text>
      )}
    </group>
  );
}

// Modal component for viewing images
function ImageModal({ images, currentIndex, isOpen, onClose, onNext, onPrevious }) {
  if (!isOpen || !images[currentIndex]) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-7xl max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              aria-label="Close"
            >
              <FaTimes size={24} />
            </button>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={onPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  aria-label="Previous"
                >
                  <FaChevronLeft size={24} />
                </button>
                <button
                  onClick={onNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  aria-label="Next"
                >
                  <FaChevronRight size={24} />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={currentImage.url}
              alt={currentImage.title || `Image ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />

            {/* Image info */}
            {currentImage.title && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-6 py-3 rounded-lg text-white">
                <p className="text-lg font-semibold">{currentImage.title}</p>
                {currentImage.description && (
                  <p className="text-sm text-gray-300 mt-1">{currentImage.description}</p>
                )}
              </div>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute top-4 left-4 bg-black/50 px-4 py-2 rounded-lg text-white text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Main Gallery Sphere component
export function GallerySphere({ images, title = "Gallery" }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef(null);
  const groupRef = useRef(null);
  const momentumRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const autoRotateRef = useRef(true);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const handleImageClick = (index) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const handlePrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  // Mouse and touch drag controls
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDown = false;
    let isTouch = false;

    const getEventPos = (e) => {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    };

    const handleStart = (e) => {
      const target = e.target;
      if (target.tagName === "CANVAS" || target.closest("canvas")) {
        isDown = true;
        isTouch = e.type === "touchstart";
        isDraggingRef.current = true;
        autoRotateRef.current = false;
        lastMousePosRef.current = getEventPos(e);
        if (isTouch) {
          e.preventDefault();
        }
      }
    };

    const handleMove = (e) => {
      if (!isDown || !isDraggingRef.current || !groupRef.current) return;

      const currentPos = getEventPos(e);
      const deltaX = currentPos.x - lastMousePosRef.current.x;
      const deltaY = currentPos.y - lastMousePosRef.current.y;

      if (groupRef.current) {
        groupRef.current.rotation.y += deltaX * 0.005;
        groupRef.current.rotation.x = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, groupRef.current.rotation.x + deltaY * 0.005)
        );
      }

      // Store momentum
      momentumRef.current.x = deltaX * 0.1;
      momentumRef.current.y = deltaY * 0.1;

      lastMousePosRef.current = currentPos;

      if (isTouch) {
        e.preventDefault();
      }
    };

    const handleEnd = () => {
      isDown = false;
      isTouch = false;
      isDraggingRef.current = false;
      // Resume auto-rotation after a delay
      setTimeout(() => {
        autoRotateRef.current = true;
      }, 2000);
    };

    // Mouse events
    container.addEventListener("mousedown", handleStart);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);

    // Touch events
    container.addEventListener("touchstart", handleStart, { passive: false });
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      container.removeEventListener("mousedown", handleStart);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      container.removeEventListener("touchstart", handleStart);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseModal();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, selectedIndex, images.length]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-[600px] relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 cursor-grab active:cursor-grabbing"
    >
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <ImageSphere 
          images={images} 
          onImageClick={handleImageClick}
          groupRef={groupRef}
          momentumRef={momentumRef}
          isDraggingRef={isDraggingRef}
          autoRotateRef={autoRotateRef}
        />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={false}
          minDistance={6}
          maxDistance={12}
          autoRotate={false}
        />
      </Canvas>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-3 rounded-lg text-white text-sm z-10 pointer-events-none">
        <p className="flex items-center gap-2">
          <span>🖱️</span>
          <span>Drag to rotate • Click image to view • Auto-rotates when idle</span>
        </p>
      </div>

      {/* Modal */}
      <ImageModal
        images={images}
        currentIndex={selectedIndex}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
}

