import React from 'react'
import { SkinnedMesh, AnimationMixer, AnimationClip, AnimationAction, LoopOnce } from 'three'
import { useLoader } from 'react-three-fiber'
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader'

export type useModelProps = {
  modelUrl: string
  actions: ModelAction[]
}
export type ModelAction = {
  name: string
  motionUrl: string
  soundUrl?: string
}
export type useModelPayload = {
  mesh: SkinnedMesh
  actions?: any
  mixer: AnimationMixer

  // transition from the current action to desired action
  // and transition back when action finished
  play: (action: any) => void
}

const useModel = ({ modelUrl, actions }: useModelProps): useModelPayload => {
  const model = useLoader(MMDLoader, modelUrl)
  const mixer = React.useMemo(() => new AnimationMixer(model), [model])

  const [modelActions, setModelActions] = React.useState<any>(null)

  React.useEffect(() => {
    const start = async () => {
      const loadActions = await getActions(model, mixer, actions) as any
      setModelActions(loadActions)

      // if there is idle motion
      if (loadActions?.idle) {
        // whenever an action is done, play idle
        mixer.addEventListener('finished', event => {
          playModifierAnimation(event.action, 0.25, loadActions.idle.motion, 0.25, true)
          // loadActions.idle.motion.reset() loadActions.idle.motion.play()
        })
        // play it by default
        loadActions.idle.motion.play()
        console.log('ready')
      }
    }
    if(model.visible) {
      start()
    }
    // eslint-disable-next-line
  }, [model.visible])

  return {
    mesh: model,
    mixer,
    actions: modelActions,
    play: action => {
      const from = modelActions[getCurrentActionName(mixer)].motion
      const to = action.motion
      playModifierAnimation(from, 0.25, to, 0.25)
    }
  }
}
export default useModel

const loadAnimation = (mesh: SkinnedMesh, url: string, name: string): Promise<AnimationClip> => {
  const loader = new MMDLoader()
  return new Promise(resolve => {
    loader.loadAnimation(url, mesh,
      animation => {
        if (name) animation.name = name
        resolve(animation as AnimationClip)
      },
      event => {
        console.log(event)
      }
    )
  })
}

const getActions = async (mesh: SkinnedMesh, mixer: AnimationMixer, actions: ModelAction[]) => {
  const modelActions = {}
  for(const action of actions) {
    const animation = await loadAnimation(mesh, action.motionUrl, action.name)
    const motion = mixer.clipAction(animation)

    // @ts-ignore
    modelActions[action.name] = { motion }
  }
  return modelActions
}

const getCurrentActionName = (mixer: AnimationMixer) => {
  // @ts-ignore
  return mixer._actions[mixer.stats.actions.inUse - 1]._clip.name
}
const playModifierAnimation = (from: AnimationAction, fSpeed: number, to: AnimationAction, tSpeed: number, isLoop?: boolean) => {
  if (!isLoop) to.setLoop(LoopOnce, 1)
  to.reset()
  to.play()
  from.crossFadeTo(to, isLoop ? 0 : fSpeed, true)
  to.crossFadeFrom(from, isLoop ? 0 : tSpeed, true)
}