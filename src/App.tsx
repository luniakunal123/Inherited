import { useState } from 'react'
import NameEntry from './components/NameEntry'
import GameScene from './components/GameScene'

export default function App() {
  const [playerName, setPlayerName] = useState<string | null>(null)

  if (!playerName) {
    return <NameEntry onSubmit={setPlayerName} />
  }

  return <GameScene playerName={playerName} />
}