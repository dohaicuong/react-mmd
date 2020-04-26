import React from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { useLoader } from 'react-three-fiber'
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper'
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader'
import { AudioListener, Audio, AudioLoader } from 'three'

type ModelProps = {
  url: string
  motion?: string
  audio?: string
  camera?: string
}
const Model: React.FC<ModelProps> = ({ url, motion, audio, camera }: any) => {
  const three = useThree()
  const mmd = useLoader(MMDLoader, url)
  const loader = React.useMemo(() => new MMDLoader(), [])
  const helper = React.useMemo(() => new MMDAnimationHelper(), [])
  const audioLoader = React.useMemo(() => new AudioLoader(), [])

  const [ready, setReady] = React.useState(false)
  React.useEffect(() => {
    if (motion && mmd.visible) {
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
    if (ready) helper.update(delta)
  })

  return <primitive object={mmd} dispose={null} />
}
export default Model