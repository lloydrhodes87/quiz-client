import React, {useEffect, useState} from 'react';
import Game from '../game/game.component';
import Login from '../login/login.component';
import io from 'socket.io-client'
import ChooseTopic from '../chooseTopics/choose-topic.component';

const socket = io('https://haines-quiz.herokuapp.com/', {
    path: '/socket.io',
    transports: ['websocket'],
    secure: true
})

const Landing = () => {
    const [allUsers, setAllUsers] = useState([])
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [topicData, setTopicData] = useState('');
    const gameMusicUrl = 'https://hainsey-quiz.s3-eu-west-1.amazonaws.com/Gameshow-Background-Tension-152kbit_Opus.mp3'
    const winMusicUrl = 'https://hainsey-quiz.s3-eu-west-1.amazonaws.com/win-end-music.mp3'
   
    useEffect(() => {
        socket.on('all-users', (users) => {
         
            setAllUsers([
                ...allUsers,
                users
            ])
        })
    }, [allUsers])

    useEffect(() => {  
        socket.on('topic-choice-details', (data) => {          
          setTopicData(data) 
        })
    }, [])

    const getTopicData = async(data) => {
      
      await socket.emit('topic-choice-details', JSON.stringify(data))
      await setTopicData(JSON.stringify(data))
    }

    useEffect(() => {
        socket.on('server-exit-game', async (data) => {
          if (data) {
            setTopicData('')      
          }
        })
    }, [])

    const getSignedInUser = (username) => {
        setUsername(username)
        username ? setIsSignedIn(true) : setIsSignedIn(false)
        socket.emit('users', username)

    }

    return (
        <div> {
            !isSignedIn && <Login getSignedInUser={getSignedInUser}/>
        }
            {
            isSignedIn && topicData === '' && <ChooseTopic username={username}
                allUsers={allUsers}
                getTopicData={getTopicData}
                socket={socket}/>
        }
            {
            isSignedIn && topicData !== '' && <Game topicData={topicData}
                username={username}
                allUsers={allUsers}
                socket={socket}
                gameMusicUrl={gameMusicUrl}
                winMusicUrl={winMusicUrl }
                />
        } </div>
    )

}

export default Landing;
