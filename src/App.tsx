import React from 'react'
import { Canvas } from 'react-three-fiber'
import Model from './components/Model'

export default () => {
  return (
    <>
      <Canvas
        style={{ width: 500, height: 500 }}
        camera={{ position: [10, 10, 40] }}
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} intensity={1} distance={1} decay={1} />

        <React.Suspense fallback={null}>
          <Model
            url='resources/models/baby_miku/baby_miku.pmx'
            motion='resources/motions/wavefile/motion.vmd'
            audio='resources/motions/wavefile/audio.mp3'
            camera='resources/motions/wavefile/camera.vmd'
          />
        </React.Suspense>
      </Canvas>
    </>
  )
}