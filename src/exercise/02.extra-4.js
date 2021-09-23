// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

// create custom hook
// use a serialize and deserialize for different data type
const useLocalStorageState = (
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) => {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      try {
        return deserialize(valueInLocalStorage)
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }

    if (defaultValue) {
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue
    }
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }

    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  // custom serialize/deserialize functions
  const serialize = name => {
    if (name) {
      const nameArr = name.split(' ')
      const firstName = nameArr.shift()
      const lastName = nameArr.pop()
      const middleName = nameArr.length ? nameArr.join(' ') : ''

      return JSON.stringify({
        firstName,
        lastName,
        middleName,
      })
    }

    return name
  }

  const deserialize = name => {
    // const {firstName, lastName} = JSON.parse(name)
    // return `${firstName} ${lastName}`
    const {firstName, middleName, lastName} = JSON.parse(name)
    return `${firstName} ${middleName} ${lastName}`
  }

  // use custom hook
  const [name, setName] = useLocalStorageState('name', initialName, {
    serialize,
    deserialize,
  })

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
  const getName = () => 'Special Guest'
  return <Greeting initialName={getName} />
}

export default App
