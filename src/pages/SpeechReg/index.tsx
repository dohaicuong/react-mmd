import React from 'react'
import annyang from 'annyang'

const SpeechReg: React.FC = () => {
  const [isStart, setIsStart] = React.useState(false)

  React.useEffect(() => {
    const commands = {
      'hello *name': helloHandle
    }

    annyang.addCommands(commands, true)

    annyang.addCallback('start', () => setIsStart(true))
    annyang.addCallback('end', () => setIsStart(false))
    annyang.addCallback('resultNoMatch', (res: any) => {
      console.log('not match')
      console.log(res)
    })
  }, [])
  const helloHandle = (name: string) => {
    console.log(name)
    const msg = new SpeechSynthesisUtterance('こにちわ')
    msg.lang = 'ja'

    // const msg2 = new SpeechSynthesisUtterance('tùng lồn')
    // msg.lang = 'vn'

    window.speechSynthesis.speak(msg)
    // window.speechSynthesis.speak(msg2)
  }

  return (
    <button onClick={() => {
      if (isStart) annyang.abort()
      else annyang.start({ autoRestart: false, continuous: true })
    }}>
      {isStart ? 'pause' : 'start'}
    </button>
  )
}
export default SpeechReg