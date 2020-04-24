import React from 'react'
// @ts-ignore
import usePromise from 'react-promise-suspense'

type ModelProps = {
  url: string
  motion?: string
  pose?: string
}
type LoaderData = {
  data: any
  objects: any[]
}
const Model: React.FC<ModelProps> = ({ url, motion, pose }) => {
  const results = usePromise<LoaderData>(() => {

  }, [])
  return null
}
export default Model