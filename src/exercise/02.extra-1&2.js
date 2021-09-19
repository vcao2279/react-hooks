// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function Greeting({initialName = ''}) {
  // to avoice performance bottle neck when initialize state
  // by passing a calculated value using an expensive function,
  // we can actually pass the expensive function
  // so that it only get called in the first render
  const getLocalStorageName = () => {
    console.log('Getting name from local storage')
    const name = window.localStorage.getItem('name') || initialName
    return name
  }
  const [name, setName] = React.useState(getLocalStorageName)

  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)
  React.useEffect(() => {
    window.localStorage.setItem('name', name)
  }, [name])

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="Guest" />
}

export default App
