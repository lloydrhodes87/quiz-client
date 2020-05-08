import React from 'react';
import Topic from '../topic/topic.component';
import './topics.styles.scss';

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




const Topics = ({username, getTopicData}) => {
  
  const handleTopicChoice = async(topic, number) => {
      getTopicData({username, topic, number})
  
 }
 
  return (
    <div className='topics-component'>
      <div>
        <h4>Choose a topic</h4>
      </div>
      <div className='topics'>
          <div onClick={() => handleTopicChoice('Animals', 27)} >
            <Topic url={animals} topic='Animals' />  
          </div>
          <div onClick={() => handleTopicChoice('Art', 25)} >
            <Topic url={art} topic='Art' />          
          </div>
          <div onClick={() => handleTopicChoice('Books', 10)} >
            <Topic url={books} topic='Books' />
          </div>
          <div onClick={() => handleTopicChoice('Cartoons', 32)} >
            <Topic url={cartoons} topic='Cartoons' />
          </div>
          <div onClick={() => handleTopicChoice('General Knowledge', 9)} >
            <Topic url={general} topic='General Knowledge' /> 
          </div>
          <div onClick={() => handleTopicChoice('History', 23)} >
            <Topic url={history} topic='History' /> 
          </div>
          <div onClick={() => handleTopicChoice('Music', 12)} >
            <Topic url={music} topic='Music' /> 
          </div>
          <div onClick={() => handleTopicChoice('Celebrities', 26)} >
            <Topic url={celebrities} topic='Celebrities' />  
          </div>
          <div onClick={() => handleTopicChoice('TV', 14)} >
            <Topic url={tv} topic='TV' /> 
          </div>
          <div onClick={() => handleTopicChoice('Mike')} >
            <Topic url={mike} topic='Mike' /> 
          </div>

      </div>   
    </div>
  )
}

export default Topics;