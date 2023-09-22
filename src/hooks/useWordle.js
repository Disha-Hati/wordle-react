import { useState } from 'react';

const useWordle=(solution)=>{

    const [turn, setTurn] = useState(0) 
    const [currentGuess, setCurrentGuess] = useState('')
    const [guesses, setGuesses] = useState([...Array(6)]) // each guess is an array
    const [history, setHistory] = useState([]) // each guess is a string-- to avoid duplicate guesses
    const [isCorrect, setIsCorrect] = useState(false)//changes to true when user wins the game
    const [usedKeys, setUsedKeys] = useState({}) // {a: 'grey', b: 'green', c: 'yellow'} etc

    //format a guess into an array of letter objects
    //e.g. [{key:'a', color:'yellow'}]
    const formatGuess = () => {
        //console.log('formatting the guess-',currentGuess)
        let solutionArray=[...solution]
        let formattedGuess=[...currentGuess].map((letter)=>{
            return{key:letter,color:'grey'}
        })

        //find green letters- correct position
        formattedGuess.forEach((letter,i)=>{
            if(solutionArray[i]===letter.key){
                formattedGuess[i].color='green'
                solutionArray[i]=null
            }
        })

        //find yellow letters-in the word but not correct position
        formattedGuess.forEach((letter,i)=>{
            if(solutionArray.includes(letter.key) && letter.color!=='green'){
                formattedGuess[i].color='yellow'
                solutionArray[solutionArray.indexOf(letter.key)]=null
            }
        })

        return formattedGuess
    }
  
    // add a new guess to the guesses state
    // update the isCorrect state if the guess is correct
    // add one to the turn state
    const addNewGuess = (formattedGuess) => {
        if(currentGuess===solution){
            setIsCorrect(true)
        }
        setGuesses((prevGuesses)=>{
            let newGuesses=[...prevGuesses]
            newGuesses[turn]=formattedGuess
            return newGuesses
        })

        setHistory((prevHistory)=>{
            return [...prevHistory,currentGuess]
        })

        setTurn((prevTurn)=>{
            return prevTurn+1
        })
        setUsedKeys(prevUsedKeys => {
            formattedGuess.forEach(l => {
              const currentColor = prevUsedKeys[l.key]
      
              if (l.color === 'green') {
                prevUsedKeys[l.key] = 'green'
                return
              }
              if (l.color === 'yellow' && currentColor !== 'green') {
                prevUsedKeys[l.key] = 'yellow'
                return
              }
              if (l.color === 'grey' && currentColor !== ('green' || 'yellow')) {
                prevUsedKeys[l.key] = 'grey'
                return
              }
            })
      
            return prevUsedKeys
          })
        setCurrentGuess('')


    }
  
    // handle keyup event & track current guess
    // if user presses enter, add the new guess
    const handleKeyup = ({key}) => {
        //console.log(key)
        if(key==='Enter'){
            //only add guess if turn is less than 5
            if(turn>5){
                console.log('you used all your guesses and tries')
                return
            }
            //no duplicates--history,sethistory
            if(history.includes(currentGuess)){
                console.log('you already tried this word')
                return
            }
            //word must be 5 chars long
            if(currentGuess.length!==5){
                console.log('Word must be 5 characters long')
                return
            }
            const formatted=formatGuess()
            addNewGuess(formatted)
            //console.log(formatted)
        }
        if(key==='Backspace'){
            setCurrentGuess((prev)=>{
                return prev.slice(0,-1)
            })
            return
        }

        if(/^[A-Za-z]$/.test(key)){
            if(currentGuess.length<5){
                setCurrentGuess((prev)=>{
                    return prev+key
                })
            }
        }

    }
  
    return {turn, currentGuess, guesses, isCorrect,usedKeys, handleKeyup}


}

export default useWordle;