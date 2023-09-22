//ui 
import React, { useState, useEffect } from 'react'
import useWordle from '../hooks/useWordle'
import Grid from './Grid'
import KeyPad from './KeyPad'
import Modal from './Modal'

export default function Wordle({solution}) {
    const {currentGuess,handleKeyup,guesses,isCorrect,turn,usedKeys}=useWordle(solution)
    const [showModal, setShowModal] = useState(false)

    useEffect(()=>{
        window.addEventListener('keyup',handleKeyup)

        if (isCorrect) {
          setTimeout(() => setShowModal(true), 2000)
          window.removeEventListener('keyup', handleKeyup)
        }
        if (turn > 5) {
          setTimeout(() => setShowModal(true), 2000)
          window.removeEventListener('keyup', handleKeyup)
        }

        return ()=>window.removeEventListener('keyup',handleKeyup)
    },[handleKeyup,isCorrect, turn])

    useEffect(()=>{
      console.log(guesses,turn,isCorrect)
    },[guesses,turn,isCorrect])

  return (
    <div>
        <div>solution-{solution}</div>
      <div>currentGuess-{currentGuess}</div>
      <Grid currentGuess={currentGuess} guesses={guesses} turn={turn}/>
      <KeyPad usedKeys={usedKeys} />
      {showModal && <Modal isCorrect={isCorrect} turn={turn} solution={solution} />}
    </div>
    
  )
}
