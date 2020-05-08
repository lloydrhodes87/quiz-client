import React, {useState, useEffect} from 'react';
import Topics from '../Topics/topics.component';
import './choose-topic.styles.scss';
import useDeepCompareEffect from 'use-deep-compare-effect';


const candyProfile = require('../../assets/profiles/candy-profile.png')
const messProfile = require('../../assets/profiles/mess-profile.png')
const ingloydProfile = require('../../assets/profiles/Ingloyd-profile.png')

const ChooseTopic = ({username, allUsers, getTopic, socket, getTopicData}) => {
    
    const [profilePic, setProfilePic] = useState('');
    const [userObject, setUserObject] = useState([]);
    useEffect(() => {
     
          if (username === 'Candy') 
            setProfilePic(candyProfile)
        if (username === 'Mess') 
            setProfilePic(messProfile)
        if (username === 'Ingloyd') 
            setProfilePic(ingloydProfile)
        findAvatar(username);
        
    }, [username]);

    // const getTopicData = async(data) => {
    //   console.log(data)
    //   await socket.emit('topic-choice-details', JSON.stringify(data))
    // }

    useDeepCompareEffect(() => {
          allUsers.map(user => {
            if (userObject.some(person => person.name === user)) {
                return user;
            } else {
                setUserObject([
                    ...userObject, {
                        name: user,
                        avatar: findAvatar(user)
                    }
                ])
            }
            return user;
        })
        
    }, [allUsers])

    const findAvatar = (name) => {
        if (name === 'Candy') 
            return candyProfile;
        

        if (name === 'Mess') 
            return messProfile;
        

        if (name === 'Ingloyd') 
            return ingloydProfile;
        

    }


    return (
        <div className='topic-page'>
            <div className="header">
                <div className='logged-in'>
                    <p>Logged in as
                        <strong>{username}</strong>
                    </p>
                    <div className='profile-pic'>
                        <img src={profilePic} alt='profile'></img>
                    </div>
                </div>
                <h1>Who's in</h1>
                <div className='space'></div>
            </div>

            <div className='all-users'>
                {
                userObject.map(user => {
                    return (
                        <div key={
                                user.name
                            }
                            className="joined-user-container">
                            <div className='joined-user'>
                                <img 
                                  src={user.avatar}
                                  alt="avatar"
                                ></img>
                            </div>

                            <label>
                                <strong>{
                                    user.name
                                }</strong>
                            </label>
                        </div>
                    )
                })
            } </div>


            <Topics getTopic={getTopic}
                username={username}
                socket={socket}
                getTopicData={getTopicData}
                />

        </div>
    )
}

export default ChooseTopic;
