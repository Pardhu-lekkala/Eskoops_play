import React from 'react';
import './scoredByTotal.css';

const ScoredByTotal = ({ gameTotalPoints, scoredTotalPoints }) => {
  return (
    <div className="scored-by-total">
      <div>Score</div>
      <div>
        {scoredTotalPoints ? scoredTotalPoints : 0} /{' '}
        {gameTotalPoints ? gameTotalPoints : 0}
      </div>
    </div>
  );
};

export default ScoredByTotal;
