import { useEffect, useRef, useState, useCallback } from 'react'
import { Story } from 'inkjs'
import type { StoryState, InkChoice, InkVariables } from '../types'

import inkJson from '../story/scene01.json'

const LOCK_REASONS: Record<string, string> = {
  'Call home. Tell them before you see it yourself.': "Your hand stopped before you got there. You don't know why.",
  'Ask her to sit with you when you tell him.': "You don't have this. You don't know yet that you can ask for that.",
  '"I didn\'t understand the chapter. I was scared to ask."': "You have never said this to him. Somewhere you learned that not knowing is the same as being wrong. You don't remember when you learned it. You just know.",
}

function parseChoices(rawChoices: any[], canCallHome: boolean): InkChoice[] {
  return rawChoices.map((c, i) => {
    const isLockedPrefix = c.text.startsWith('LOCKED:')
    const isFaint = c.text.startsWith('FAINT:')
    const isPermanentLock = c.text.startsWith('PERMANENT:')

    const text = c.text
      .replace('LOCKED:', '')
      .replace('FAINT:', '')
      .replace('PERMANENT:', '')
      .trim()

      const isCallHome = text.includes('Call home')
      const isUnlocked = isCallHome && canCallHome
      const isLocked = isPermanentLock || (isLockedPrefix && !isUnlocked)
      const isFaintFinal = isFaint || isUnlocked

      return {
        text,
        index: i,
        isLocked,
        isPermanentLock,
        isFaint: isFaintFinal,
        lockReason: LOCK_REASONS[text] ?? '',
      }
  })
}

export function useInkStory(playerName: string) {
  const storyRef = useRef<InstanceType<typeof Story> | null>(null)
  const [state, setState] = useState<StoryState>({
    paragraphs: [],
    choices: [],
    variables: {} as InkVariables,
    tags: [],
    isEnded: false,
  })
  const [lockMessage, setLockMessage] = useState<string | null>(null)

  const readVariables = useCallback(
    (story: InstanceType<typeof Story>): InkVariables => ({
      player_name: playerName,
      can_call_home: story.variablesState['can_call_home'] as boolean,
      is_mahesh: story.variablesState['is_mahesh'] as boolean,
      current_act: story.variablesState['current_act'] as number,
      chose_kind_option: story.variablesState['chose_kind_option'] as boolean,
      composure: story.variablesState['composure'] as number,
      energy: story.variablesState['energy'] as number,
      stress: story.variablesState['stress'] as number,
    }),
    [playerName]
  )

  const advance = useCallback(() => {
    const story = storyRef.current
    if (!story) return
    setLockMessage(null)

    const lines: string[] = []
    let currentTags: string[] = []

    while (story.canContinue) {
      const line = story.Continue() ?? ''
const tags = story.currentTags ?? []

if (tags.length > 0) {
  currentTags = [...tags]
}

      if (line.trim() === '[BREAK]') {
        break
      }

      if (line.trim()) {
        lines.push(line.replace(/\{player_name\}/g, playerName))
      }
    }

    const variables = readVariables(story)
    const currentChoices = story.currentChoices
    const uniqueTags = [...new Set(currentTags)]

    setState({
      paragraphs: lines,
      choices: parseChoices(currentChoices, variables.can_call_home),
      variables,
      tags: uniqueTags,
      isEnded: !story.canContinue && currentChoices.length === 0,
    })
  }, [playerName, readVariables])

  useEffect(() => {
    try {
      storyRef.current = new Story(JSON.stringify(inkJson))
      storyRef.current.variablesState['player_name'] = playerName
      advance()
    } catch (e) {
      console.error('Ink error:', e)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const choose = useCallback(
    (choice: InkChoice) => {
      if (choice.isLocked) {
        setLockMessage(choice.lockReason ?? null)
        setTimeout(() => setLockMessage(null), 2000)
        return
      }
      const story = storyRef.current
      if (!story) return

      if (choice.index === -1) {
        advance()
        return
      }

      story.ChooseChoiceIndex(choice.index)
      advance()
    },
    [advance]
  )

  return { state, choose, lockMessage }
}