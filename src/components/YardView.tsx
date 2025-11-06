import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { yardPlants, type Plant } from '../lib/demoProfileData'
import DashboardWidget from './DashboardWidget'
import Flower from './plants/Flower'
import Tree from './plants/Tree'
import Bush from './plants/Bush'

export default function YardView() {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const yardWidth = 600
  const yardHeight = 400

  const getPlantSize = (type: Plant['type'], growthStage: number): number => {
    if (type === 'tree') {
      return 50 + (growthStage * 8)
    } else if (type === 'flower') {
      return 40 + (growthStage * 6)
    } else {
      return 35 + (growthStage * 5)
    }
  }

  const renderPlant = (plant: Plant) => {
    const size = getPlantSize(plant.type, plant.growthStage)
    const x = (plant.x / 100) * yardWidth
    const y = (plant.y / 100) * yardHeight

    const PlantComponent = plant.type === 'tree' ? Tree : plant.type === 'flower' ? Flower : Bush

    return (
      <motion.g
        key={plant.id}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
      >
        <foreignObject
          x={x - size / 2}
          y={y - size}
          width={size}
          height={size}
          className="cursor-pointer"
          onClick={() => setSelectedPlant(plant)}
        >
          <motion.div
            className="flex items-center justify-center"
            whileHover={{ scale: 1.15, y: -5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <PlantComponent growthStage={plant.growthStage} size={size} />
          </motion.div>
        </foreignObject>
        <title>{plant.name}</title>
      </motion.g>
    )
  }

  return (
    <DashboardWidget title="Your Yard" icon="🌳">
      <div className="space-y-6">
        <p className="text-sm font-bold">
          Your mental health garden grows with your consistency and progress. Each plant represents an achievement!
        </p>

        {/* Yard Visualization */}
        <div className="relative border-neo shadow-neo bg-neo-green" style={{ minHeight: yardHeight }}>
          {/* Sky section with neo blue */}
          <div className="absolute inset-0 bg-neo-blue" style={{ height: '40%' }} />
          
          {/* Ground section with neo green */}
          <div className="absolute bottom-0 left-0 right-0 bg-neo-green" style={{ height: '60%' }} />
          
          {/* Decorative geometric shapes */}
          <div className="absolute top-2 right-2 w-16 h-16 border-4 border-black bg-neo-yellow shadow-neo-sm" />
          <div className="absolute top-6 left-4 w-12 h-12 border-4 border-black bg-white shadow-neo-sm" />
          <div className="absolute top-12 right-8 w-8 h-8 border-4 border-black bg-neo-pink shadow-neo-sm" />
          
          {/* Grass pattern with bold lines */}
          <svg className="absolute bottom-0 left-0 w-full" style={{ height: '60%' }} viewBox="0 0 600 240" preserveAspectRatio="none">
            {Array.from({ length: 30 }).map((_, i) => (
              <line
                key={i}
                x1={i * 20}
                y1="240"
                x2={i * 20 + 10}
                y2="220"
                stroke="#000"
                strokeWidth="3"
              />
            ))}
          </svg>

          {/* Plants SVG */}
          <svg
            width="100%"
            height={yardHeight}
            viewBox={`0 0 ${yardWidth} ${yardHeight}`}
            className="relative z-10"
            style={{ minHeight: yardHeight }}
          >
            {yardPlants.map(plant => renderPlant(plant))}
          </svg>
        </div>

        {/* Plant Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {yardPlants.map(plant => {
            const isSelected = selectedPlant?.id === plant.id
            const PlantComponent = plant.type === 'tree' ? Tree : plant.type === 'flower' ? Flower : Bush

            return (
              <motion.button
                key={plant.id}
                onClick={() => setSelectedPlant(plant)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 border-neo shadow-neo-sm text-left transition-all ${
                  isSelected
                    ? 'bg-neo-yellow shadow-neo'
                    : 'bg-white hover:bg-neo-green'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <PlantComponent growthStage={plant.growthStage} size={40} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-sm truncate uppercase">{plant.name}</div>
                    <div className="text-xs font-bold">
                      Stage {plant.growthStage}/5
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Selected Plant Details */}
        <AnimatePresence>
          {selectedPlant && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 border-neo shadow-neo bg-neo-yellow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 border-4 border-black bg-white p-2 shadow-neo-sm">
                  {selectedPlant.type === 'tree' ? (
                    <Tree growthStage={selectedPlant.growthStage} size={80} />
                  ) : selectedPlant.type === 'flower' ? (
                    <Flower growthStage={selectedPlant.growthStage} size={80} />
                  ) : (
                    <Bush growthStage={selectedPlant.growthStage} size={80} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-xl mb-2 uppercase">{selectedPlant.name}</h4>
                  <p className="text-sm font-bold mb-4">{selectedPlant.achievement}</p>
                  <div className="flex items-center gap-4 text-xs font-bold mb-4">
                    <span>Planted: {new Date(selectedPlant.plantedDate).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Growth: {selectedPlant.growthStage}/5</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 h-6 border-4 border-black bg-white overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(selectedPlant.growthStage / 5) * 100}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full bg-neo-green"
                        />
                      </div>
                      <span className="text-sm font-black min-w-[3rem] text-right">
                        {Math.round((selectedPlant.growthStage / 5) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Yard Stats */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t-4 border-black">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center p-4 border-neo shadow-neo-sm bg-neo-blue"
          >
            <div className="text-4xl font-black">
              {yardPlants.length}
            </div>
            <div className="text-xs font-black uppercase mt-1">Total Plants</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center p-4 border-neo shadow-neo-sm bg-neo-green"
          >
            <div className="text-4xl font-black">
              {yardPlants.filter(p => p.growthStage >= 4).length}
            </div>
            <div className="text-xs font-black uppercase mt-1">Fully Grown</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center p-4 border-neo shadow-neo-sm bg-neo-pink text-white"
          >
            <div className="text-4xl font-black">
              {Math.round(yardPlants.reduce((sum, p) => sum + p.growthStage, 0) / yardPlants.length)}
            </div>
            <div className="text-xs font-black uppercase mt-1">Avg Growth</div>
          </motion.div>
        </div>
      </div>
    </DashboardWidget>
  )
}
