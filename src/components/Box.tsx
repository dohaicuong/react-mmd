import React from 'react'
// import { useFrame } from 'react-three-fiber'

type BoxProps = {
  position: any
}
const Box: React.FC<BoxProps> = (props) => {
  const mesh = React.useRef<any>(null)
  const [hovered, setHover] = React.useState(false)
  const [active, setActive] = React.useState(false)

  // useFrame(() => {
  //   if (mesh && mesh.current) return mesh.current.rotation.x = mesh.current.rotation.y += 0.01
  // })

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={e => setActive(!active)}
      onPointerOver={e => setHover(true)}
      onPointerOut={e => setHover(false)}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}
export default Box