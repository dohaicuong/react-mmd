import React from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { useLoader } from 'react-three-fiber'
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper'
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader'
import { AudioListener, Audio, AudioLoader } from 'three'

export default () => {
  return (
    <>
      <Canvas
        style={{ width: 500, height: 500 }}
        camera={{ position: [10, 10, 40] }}
      >
        <ambientLight />
        <pointLight position={[50, 50, 50]} intensity={0.5} distance={3} decay={2} />

        <React.Suspense fallback={null}>
          <Asset
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

const Asset = ({ url, motion, audio, camera }: any) => {
  const three = useThree()
  const mmd = useLoader(MMDLoader, url)
  const loader = React.useMemo(() => new MMDLoader(), [])
  const helper = React.useMemo(() => new MMDAnimationHelper(), [])
  const audioLoader = React.useMemo(() => new AudioLoader(), [])

  const [ready, setReady] = React.useState(false)
  React.useEffect(() => {
    if(motion && mmd.visible) {
      // load animation and pour into mesh
      loader.loadWithAnimation(url, motion, ({ animation }) => helper.add(mmd, { animation, physics: true }))
      // load camera motion and pour into camera
      loader.loadAnimation(camera, three.camera, cameraAnimation => {
        // @ts-ignore
        helper.add(three.camera, { animation: cameraAnimation })
      })
      // load audio
      audioLoader.load(audio, buffer => {
        const listener = new AudioListener()
        const audio = new Audio(listener).setBuffer(buffer)
        listener.position.z = 1
        helper.add(audio, { delayTime: 160 * 1 / 30 })
        setReady(true)
      })
    }


  // eslint-disable-next-line
  }, [motion, mmd.visible])

  useFrame((_, delta) => {
    if (ready) {
      // console.log(three.camera)
      return helper.update(delta)
    }
  })

  return <primitive object={mmd} dispose={null} />
}