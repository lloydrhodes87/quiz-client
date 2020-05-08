import React from 'react';
import './topic.styles.scss';

const Topic = ({url, topic}) => {
  return (
    <div className='topic-item'>
      <img src={url} alt={topic}></img>
      <label><strong>{topic}</strong></label>
    </div>
  )
}

export default Topic;

