import React, {useEffect, useState, useRef, useCallback } from 'react';
import './main-game.styles.scss';

const MainGame = ({
    questions,
    username,
    socket,
    topicImage,
    allAvatars,
    gameMusicUrl,
    winMusicUrl
}) => {
    const exit = require('../../assets/exit.png')
    const eggTimer = require('../../assets/egg-timer.gif')
    const podium = require('../../assets/podium.png')
    const tears = require('../../assets/tears.gif')
    const fireworkBlue = require('../../assets/fireworkblue.gif')
    const fireworkRed = require('../../assets/fireworkred.gif')


    let [questionNum, setQuestionNum] = useState(0);
    const [answerArray, setAnswerArray] = useState([]);
    const [question, setQuestion] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('')
    const [userScores, setUserScores] = useState([])
    const [disableButtons, setDisableButtons] = useState(false)
    let [timer, setTimer] = useState(20)
    const [gameState, setGameState] = useState('play')
    const [showScores, setShowScores] = useState(false)
    const [winnerList, setWinnerList] = useState([])
    const [gameMusicAudio] = useState(new Audio(gameMusicUrl));
    const [winMusicAudio] = useState(new Audio(winMusicUrl))

    const questionNumRef = useCallback(node => {
      if (node !== null) {
        setQuestionNum(node);
      }
    }, []);




  
    function useInterval(callback, delay) {
      const savedCallback = useRef();
      useEffect(() => {
        savedCallback.current = callback;
      }, [callback]);
  
      useEffect(() => {
        function tick() {
          savedCallback.current();
        }
        if (delay !== null) {
          let id = setInterval(tick, delay);
          return () => clearInterval(id);
        }
      }, [delay]);
    }

    useEffect(() => {
        const userScoreObject = allAvatars.map((user) => {
            user.score = 0;
            return user;
        })

        setUserScores(userScoreObject)
    }, [allAvatars])



    useInterval(() => {
      if (gameState === 'play') {
        setTimer(timer -= 1)
        
      }
      if (timer === 0) {
        setTimer(20)
      }
     
    }, 1000);


    useEffect(() => {
      if (gameState === 'play') {
        gameMusicAudio.play()
      } else {
        gameMusicAudio.pause()
      }
    },[gameState])


    useEffect(() => {
        socket.on('user-scores', (scores) => {
            const parsed = JSON.parse(scores)
            setUserScores(parsed.updated)
            setDisableButtons(false)

        })
        return () => { socket.off('user-scores') }
    }, [setUserScores, setDisableButtons, socket])


    useEffect(() => {
        socket.on('question-number', async (num) => {
            await questionNumRef(num)
            if (questionNum === 19) {
                setGameState('pause')
                setShowScores(true)
            }
        })
        return () => { socket.off('question-number') }
    }, [questionNum, socket, questionNumRef])


    useEffect(() => {
        if (timer === 0) {
            setTimer(20)
            if (questionNum <= 19) {
                
              setQuestionNum(questionNum+=1)
            } else {
                setGameState('pause')
                setShowScores(true)
                gameMusicAudio.pause();
                winMusicAudio.play();
            }

        }
    }, [timer, setQuestionNum, questionNum, setGameState, setShowScores])

   

    useEffect(() => {
        socket.on('server-game-state', (data) => {
            setGameState(data)
        })
        return () => { socket.off('server-game-state')}
      }, [setGameState, socket])


    useEffect(() => {
        socket.on('server-timer', (data) => {
            setTimer(Number(data))
        })
        return () => { socket.off('server-timer') }
    }, [timer, setTimer, socket])

    useEffect(() => {
      
      const winnerOrder = userScores.sort((a, b) => {
       return  b.score - a.score;
      })

      setWinnerList(winnerOrder)


 
    }, [showScores])


    useEffect(() => {
        if (questions.length > 0) {
            if (questionNum <= 19) {
                setQuestion(questions[questionNum].question)
                const answers = [
                    ...questions[questionNum].incorrect_answers,
                    questions[questionNum].correct_answer
                ]

                setCorrectAnswer(questions[questionNum].correct_answer)
                setAnswerArray(shuffle(answers))
                setDisableButtons(false)
            } else {
              setShowScores(true)
              gameMusicAudio.pause()
              winMusicAudio.play()
            }
        }
    }, [questions, questionNum])

    useEffect(() => {
      socket.on('server-exit-game', (data) => {
        gameMusicAudio.pause();
        winMusicAudio.pause();
      })
      return () => {
        socket.off('server-exit-game')
      }
    },[socket])


    const shuffle = (array) => {
        return array.sort(() => Math.random() - 0.5);
    }

    const handleExit = async () => {
          await socket.emit('exit-game', true) 
    }


    const handleAnswer = async (answer) => {
        if (answer === correctAnswer) {
          const updated = userScores.map(user => {
            if (username === user.usermame) {
                user.score = user.score + 1;
            }
            return user;
        })
          
            await socket.emit('set-user-scores', JSON.stringify({answeredBy: username, updated}))

            await socket.emit('set-timer', 20)
            await socket.emit('game-state', 'play')
            await socket.emit('question-number', questionNum + 1)
            

            //
        } else {
       
            setDisableButtons(true)
        }
    }

    return (
      <div> 
        {
          !showScores && 
            <div>
              <div className='game-header'>
                <div className='topic'>
                  <div className='game-topic-container'>
                    <img 
                      src={topicImage}
                      alt="topic"
                    >
                    </img>
                  </div>
                </div>
                
                <div className='game-question'>
        <h2>{questionNum + 1}) {question}</h2>
                </div>
                    
                <div 
                  className='game-exit'
                  onClick={handleExit}>
                    <img 
                      src={exit}
                      alt="exit"
                    ></img>
                  </div>
                </div>
                {
                gameState === 'play' && <div className='times-section'>
                    <div className="countdown">
                        {timer} </div>
                    <div className="egg-timer">
                        <img src={eggTimer}
                            alt='egg-timer-gif'></img>
                    </div>
                    <div className='spacer'></div>
                </div>
                }
                {
                answerArray && 
                  <div className='answers'>
                    {
                    answerArray.map((answer, index) => {
                      const letter = () => {
                        switch (index) {
                          case 0:
                            return 'a) ';
                          case 1:
                            return 'b) ';
                          case 2:
                            return 'c) ';
                          case 3:
                            return 'd) ';
                        }
                      }
                      return (
                        <div 
                          key={answer}
                          className={`class-${index}`}
                        >
                          <button disabled={disableButtons}
                            onClick={() => handleAnswer(answer)}
                            className={disableButtons ? 'disabled' : ''}>
                            {letter()}
                            {answer} 
                          </button>
                        </div>
                      )
                    })
                    } 
                  </div>
                }

                <h2>Scores</h2>
                <div className='scores-container'>
                  {
                  userScores && userScores.map((user, index) => {
                    return (
                      <div 
                        key={index}
                        className='scores'
                      >
                        <div>
                          <div className='image'>
                            <img 
                              src={user.avatar}
                              alt='avatar'
                            >
                            </img>
                          </div>
                          <p>{user.score}</p>
                        </div>
                      </div>
                    )
                  })
                  } 
                </div>
              </div>
        
        } 
        {
          showScores && winnerList.length > 0 && 
            <div className="end-scores">
              <div className='game-exit'
                onClick={handleExit}>
                <img src={exit}
                    alt="exit"></img>
              </div>
              <div className="winner-header">
                <h2>The winner is {winnerList[0].usermame}!!!</h2>
                <div className='fireworks'>
                  <img src={fireworkBlue} alt='firework' className='firework-blue'></img>
                  <img src={fireworkRed} alt='firework' className='firework-red'></img>

                </div>
              
              </div>
              <div className="podium">
                <div className="podium-avatars">
                    <div className='second'>
                      <h2>{winnerList[1].score}</h2>
                      <img src={winnerList[1].avatar}></img>
                      <div className='tears'>
                        <img src={tears} className='tear-1' alt='tears'></img>
                        <img src={tears} className='tear-2' alt='tears'></img>
                        <img src={tears} className='tear-3' alt='tears'></img>
                        <img src={tears} className='tear-4' alt='tears'></img>
                      </div>
                      
                    </div>
                    
                    <div className='first'>
                    <h2>{winnerList[0].score}</h2>
                      <img src={winnerList[0].avatar}></img>
                      
                    </div>
                    <div className='third'>
                      <h2>{winnerList[2].score}</h2>
                      <img src={winnerList[2].avatar}></img>
                      <div className='tears'>
                        <img src={tears} className='tear-1' alt='tears'></img>
                        <img src={tears} className='tear-2' alt='tears'></img>
                        <img src={tears} className='tear-3' alt='tears'></img>
                        <img src={tears} className='tear-4' alt='tears'></img>
                      </div>
                    </div>
                </div>
                <div className="stand">
                  <img src={podium}></img>
                </div>
                
              </div>
                
            </div>
            }
      </div>
    )

}


export default MainGame;
