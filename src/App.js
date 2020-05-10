import React, { useState } from 'react';
import moment from 'moment'
import { FaTimes, FaAngleLeft, FaAngleRight, FaPlus, FaCheck, FaTrash } from 'react-icons/fa';
import './App.css';

function App() {
  const intialHabits = JSON.parse(localStorage.getItem('habits')) || [];
  const [text, setText] = useState('')
  const [habits, setHabits] = useState(intialHabits)
  const [activeHabit, setActiveHabit] = useState(null)

  function persistHabits(habits) {
    localStorage.setItem('habits', JSON.stringify(habits))
  }

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const addItem = (text) => {
    const h = [...habits, {text, days: [], id: uuidv4()}]
    setHabits(h)
    persistHabits(h)
  }

  const deleteHabit = (e, habit) => {
    e.stopPropagation()
    const newHabits = habits.filter(x => x.id !== habit.id)
    setHabits(newHabits)
    persistHabits(newHabits)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addItem(text)
    setText('')
  }

  const openActiveHabit = (item) => {
    item.activeDay = moment().format('M/D/YY')
    setActiveHabit(item)
  }

  const toggleDay = () => {
    const currDay = activeHabit.activeDay
    let dayList
    if (activeHabit.days.includes(currDay)) {
      dayList = activeHabit.days.filter(x => x !== currDay)
    } else {
      dayList = [...activeHabit.days, currDay].sort((a, b) => new Date(a) - new Date(b))
    }
    const hab = {...activeHabit, days: dayList}
    setActiveHabit(hab)
    const newHabits = habits.map(item => item.id === activeHabit.id ? hab : item)
    setHabits(newHabits)
    persistHabits(newHabits)
  }

  const decrementDay = () => {
    const start = moment(activeHabit.activeDay)
    setActiveHabit({...activeHabit, activeDay: start.subtract(1, 'day').format('M/D/YY')})
  }

  const incrementDay = () => {
    const start = moment(activeHabit.activeDay)
    const dayLater = start.add(1, 'day').format('M/D/YY')
    if (moment().isBefore(dayLater)) {
      return
    }
    setActiveHabit({...activeHabit, activeDay: dayLater})
  }

  const computeStreak = (days) => {
    let streak = []
    let longestStreak = 0
    days.forEach(day => {
      if (!streak.length) {
        streak.push(day)
      } else {
        const last = streak.slice(-1)[0]
        if (moment(last).add(1, 'days').format('MM/DD/YY') === moment(day).format('MM/DD/YY')) {
          streak.push(day)
        } else {
          streak = []
        }
      }
    })
    return {label: streak[0] + ' - ' + streak.slice(-1)[0], count: streak.length}
  }

  const includesDay = activeHabit && activeHabit.days.includes(activeHabit.activeDay)
  
  return (
    <div className="App">
      <div>
        <ul>
          {
            habits.map(
              item => (
                <li 
                  className="habit-item"
                  onClick={() => openActiveHabit(item)} key={item.id}>
                <span>{item.text}</span>
                <FaTrash onClick={(e) => deleteHabit(e, item)}/>
                </li>
              )
            )
          }
        </ul>
      </div>
      <div>
        <div className="add-item">
          <form onSubmit={handleSubmit}>
            <input 
              value={text}
              placeholder="Add a habit"
              onChange={(e) => setText(e.target.value)} 
            />
            <button type="submit"><FaPlus /></button>
          </form>
        </div>
      </div>
      {
        activeHabit ?
        <div className="overlay">
          <div className="overlay-top">
            <span className="overlay-text">{activeHabit.text}</span>
            <span className="overlay-close" onClick={() => setActiveHabit(null)}>
            <FaTimes />
            </span>
          </div>
          
          <div>
            <div className="overlay-metric">
              <h4>completed: {activeHabit.days.length} day{activeHabit.days.length !== 1 ? <span>s</span> : <span></span>}</h4>
              <h4>longest streak: {computeStreak(activeHabit.days).label} ({computeStreak(activeHabit.days).count} days)</h4>
            </div>
            <div className="overlay-arrows">
              <span onClick={decrementDay}>
                <FaAngleLeft size="30" />
              </span>
              <span className="overlay-time">{activeHabit.activeDay}</span>
              <span onClick={incrementDay}>
                <FaAngleRight size="30" />
              </span>
            </div>
          </div>

          <div className="overlay-bottom">
            <button 
              onClick={toggleDay}
              className={includesDay ? "overlay-button active" : "overlay-button"}>
              {includesDay ? <span>completed <FaCheck /></span> : <span>no check-in</span>}
            </button>
          </div>
        </div>
        : null
      }
      
    </div>
  );
}

export default App;
