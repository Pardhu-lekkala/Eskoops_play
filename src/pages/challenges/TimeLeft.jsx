import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './timeLeft.css';

const TimeLeft = ({ userLoginTime, gameDuration }) => {
    const history = useHistory();

    //  + parseInt(gameDuration) * 60 * 1000
    const [, setDays] = useState('0');
    const [hour, setHour] = useState('0');
    const [min, setMin] = useState('0');
    const [seconds, setSeconds] = useState('0');

    const [gameExpired, setGameExpired] = useState(false);

    useEffect(() => {
        let timeInterval;
        if (userLoginTime !== '' && gameDuration) {
            timeInterval = setInterval(() => {
                // Get today's date and time
                var now = new Date().getTime();
                // Find the distance between now and the count down date
                var distance = new Date(userLoginTime).getTime() + parseInt(gameDuration) * 60 * 1000 - now;

                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                setDays(`${days}`);
                setHour(`${hours}`);
                setMin(`${minutes}`);
                setSeconds(`${seconds}`);

                if (distance <= 0) {
                    clearInterval(timeInterval)
                    setGameExpired(true);
                    setDays("0")
                    setHour("0")
                    setMin("0")
                    setSeconds("0")
                    localStorage.clear();
                    history.push("/", { fromChallenges: true });
                }

            }, 1000);
        }

        return () => {
            clearInterval(timeInterval);
        };
    }, [userLoginTime, gameDuration, history]);

    if (!gameDuration) return null;

    return (
        <div className="time-left-container">
            <span className="time-left-time">
                {hour.padStart(2, 0)}h{' '}
                <span className={gameExpired ? '' : "time-left-colon"}>:{' '}</span>
                {min.padStart(2, 0)}m{' '}
                <span className={gameExpired ? '' : "time-left-colon"}>:{' '}</span>
                {seconds.padStart(2, 0)}s{' '}
            </span>
        </div>
    );
};

export default TimeLeft;
