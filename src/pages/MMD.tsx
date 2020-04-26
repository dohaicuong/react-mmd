import React from 'react'
import { Canvas, useFrame, extend, useThree } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import annyang from 'annyang'
import { Fab } from '@material-ui/core'
import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'

import useModel from '../hooks/useModel'
import Box from '../components/Box'

export default () => {
  const [isStart, setIsStart] = React.useState(false)
  React.useEffect(() => {
    annyang.addCallback('start', () => {
      console.log('listening')
      setIsStart(true)
    })
    annyang.addCallback('end', () => {
      console.log('ended')
      setIsStart(false)
    })
  }, [])
  const clickHandle = () => {
    if (isStart) annyang.abort()
    else annyang.start({ autoRestart: false, continuous: true })
  }

  return (
    <>
      <Fab
        onClick={clickHandle} color='primary'
        style={{ position: 'absolute', bottom: '8rem', left: 'calc(50% - 28px)', zIndex: 1 }}
      >
        {isStart ? <MicIcon /> : <MicOffIcon />}
      </Fab>
      <Canvas
        style={{ width: '100vw', height: '100vh' }}
        camera={{ position: [10, 10, 40] }}
        gl2
      >
        <Scene />
      </Canvas>
    </>
  )
}

extend({ OrbitControls })
const Scene = () => {
  const { camera, gl: { domElement }} = useThree()

  // @ts-ignore
  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} intensity={1} distance={1} decay={1} />
      <orbitControls args={[camera, domElement]} />
      <React.Suspense fallback={<Box position={[-1.2, 0, 0]} />}>
        <Miku />
      </React.Suspense>
    </>
  )
}

const Miku: React.FC = () => {
  const { mesh, mixer, actions, play } = useModel({
    modelUrl: 'resources/models/baby_miku/baby_miku.pmx',
    actions: [
      { name: 'idle', motionUrl: 'resources/motions/standing.vmd' },
      { name: 'waving', motionUrl: 'resources/motions/waving.vmd' },
    ]
  })

  React.useEffect(() => {
    if(actions && actions.waving) {
      annyang.addCommands({
        'hello *name': () => {
          play(actions.waving)
          setTimeout(() => {
            const msg = new SpeechSynthesisUtterance('こにちわ')
            msg.lang = 'ja'
            window.speechSynthesis.speak(msg)
          }, 1000)
        }
      }, true)
      annyang.addCallback('resultNoMatch', (res: any) => {
        console.log('not match')
        console.log(res)
      })
    }
  }, [play, actions])

  useFrame((_, delta) => mixer.update(delta))

  return <primitive object={mesh} dispose={null} />
}