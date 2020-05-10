import React, {useEffect, useState, useRef} from 'react';
import './game.component.scss';
import MainGame from '../main-game/main-game.component';
import musicQuestions from '../../assets/questions/music';
import animalQuestions from '../../assets/questions/animals';
import artQuestions from '../../assets/questions/art';
import bookQuestions from '../../assets/questions/books';
import generalQuestions from '../../assets/questions/general';
import cartoonQuestions from '../../assets/questions/cartoons';
import historyQuestions from '../../assets/questions/history';
import celebQuestions from '../../assets/questions/celebs';
import tvQuestions from '../../assets/questions/tv';
import mikeQuestions from '../../assets/questions/mike';


const candyProfile = require('../../assets/profiles/candy-profile.png')
const messProfile = require('../../assets/profiles/mess-profile.png')
const ingloydProfile = require('../../assets/profiles/Ingloyd-profile.png')

const animals = require('../../assets/topics/animals.png')
const art = require('../../assets/topics/art.png')
const books = require('../../assets/topics/books.png')
const cartoons = require('../../assets/topics/cartoons.png')
const general = require('../../assets/topics/general.png')
const history = require('../../assets/topics/history.png')
const mike = require('../../assets/topics/mike.png')
const music = require('../../assets/topics/music.png')
const celebrities = require('../../assets/topics/celebrities.png')
const tv = require('../../assets/topics/tv.png')



const Game = ({
    topicData,
    username,
    allUsers,
    socket,
    gameMusicUrl,
    winMusicUrl
}) => {
    const [topicState, setTopicState] = useState(null);
    const [avatar, setAvatar] = useState('');
    const [topicImage, setTopicImage] = useState('');
    const [gameState, setGameState] = useState('preGame');
    const [questions, setQuestions] = useState([]);
    const [allAvatars] = useState([
        {
            usermame: 'Candy',
            avatar: candyProfile
        }, {
            usermame: 'Mess',
            avatar: messProfile
        }, {
            usermame: 'Ingloyd',
            avatar: ingloydProfile
        }
    ])

    let [seconds, setSeconds] = useState(10)


    useEffect(() => {
     
        setTopicState(JSON.parse(topicData));
 
        
    }, [topicData])

    useEffect(() => {
      
          if (topicState) {
            findAvatar(topicState.username);
            findTopicImage(topicState.topic);
      
        }
            }, [topicState])



    useInterval(() => {
      if (topicState) {
        setSeconds(seconds -= 1)
        if (seconds === 0) {
          setGameState('game')
        
        }
      }

    }, 1000);

    useEffect(() => {
        if (topicState) {
            const questions = getQuestions(topicState.topic)
            socket.emit('questions', JSON.stringify(questions))
        }
    }, [topicState, socket]);

    useEffect(() => {
        socket.on('questions', (data) => {
            const results = JSON.parse(data)
            setQuestions(results.results)
        })
        return () => { socket.off('questions')}

    }, [socket])


    function useInterval(callback, delay) {
      const savedCallback = useRef();
    
      // Remember the latest callback.
      useEffect(() => {
        savedCallback.current = callback;

      }, [callback]);
    
      // Set up the interval.
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

    const getQuestions = (topic) => {
      switch(topic) {
        case 'Animals':
            return animalQuestions;
        case 'Art':
            return artQuestions
        case 'Books':      
            return bookQuestions;
        case 'Cartoons':     
            return cartoonQuestions;
        case 'General Knowledge':   
            return generalQuestions;
        case 'History':
            return historyQuestions;
        case 'Music':
            return musicQuestions;
        case 'Celebrities':
            return celebQuestions;
        case 'TV':
            return tvQuestions;
        case 'Mike':
        
            return mikeQuestions;
      }
    }

    const findAvatar = (name) => {
        if (name === 'Candy') 
            setAvatar(candyProfile);
        if (name === 'Mess') 
            setAvatar(messProfile);
        if (name === 'Ingloyd') 
            setAvatar(ingloydProfile);
    }

    const findTopicImage = (topicName) => {
        switch (topicName) {
            case 'Animals':
                setTopicImage(animals);
                return;
            case 'Art':
                setTopicImage(art);
                return;
            case 'Books':
                setTopicImage(books);
                return;
            case 'Cartoons':
                setTopicImage(cartoons);
                return;
            case 'General Knowledge':
                setTopicImage(general);
                return;
            case 'History':
                setTopicImage(history);
                return;
            case 'Music':
                setTopicImage(music);
                return;
            case 'Celebrities':
                setTopicImage(celebrities);
                return;
            case 'TV':
                setTopicImage(tv);
                return;
            case 'Mike':
                setTopicImage(mike);
                return;
              default:
                setTopicImage(general);
                return;
        }
    }


    return (
        <div> {
            topicState && <div> {
                gameState === 'preGame' && <div className='pregame-container'>
                    <div>
                        <h4>Wow! fast fingers {
                            topicState.username
                        }!</h4>
                        <h4>The topic is {
                            topicState.topic
                        }</h4>
                    </div>
                    <div className='pregame-image-container'>
                        <div className='pregame-image'>
                            <img src={avatar} alt='avatar'></img>
                        </div>
                        <div className='pregame-image'>
                            <img className='topic-image'
                                src={topicImage} alt="topic"></img>
                        </div>
                    </div>

                    <h5>Get Ready Guys!!!</h5>


                    <div className='seconds'>
                        {seconds} </div>
                </div>
            }
                {
                gameState === 'game' && questions.length > 0 && <MainGame topicState={topicState}
                    questions={questions}
                    username={username}
                    allUsers={allUsers}
                    socket={socket}
                    topicImage={topicImage}
                    allAvatars={allAvatars}
                    gameMusicUrl={gameMusicUrl}
                    winMusicUrl={winMusicUrl}
                  />
            } </div>
        } </div>
    )
}

export default Game;
