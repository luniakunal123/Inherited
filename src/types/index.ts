export type Character =
  | 'rahul_teen_neutral'
  | 'rahul_teen_tense'
  | 'rahul_child_neutral'
  | 'rahul_child_tense'
  | 'rahul_child_fear'
  | 'papa_tired'
  | 'papa_controlled'
  | 'papa_blank'
  | 'none'

export type Background =
  | 'classroom_day'
  | 'home_entrance_evening'
  | 'living_room_night'
  | 'bedroom_day'
  | 'office_corridor'
  | 'fade_grey'
  | 'fade_white'
  | 'black'

export type SoundState =
  | 'classroom_ambient'
  | 'cooker'
  | 'fan'
  | 'silence'
  | 'none'

export type InkChoice = {
  text: string
  index: number
  isLocked: boolean
  isPermanentLock: boolean
  isFaint: boolean
  lockReason?: string
}

export type InkVariables = {
  player_name: string
  can_call_home: boolean
  is_mahesh: boolean
  current_act: number
  chose_kind_option: boolean
  composure: number
  energy: number
  stress: number
}

export type StoryState = {
  paragraphs: string[]
  choices: InkChoice[]
  variables: InkVariables
  tags: string[]
  isEnded: boolean
}

export type AtmosphereState = {
  background: Background
  character: Character
  sound: SoundState
  filterIntensity: number
  showBars: boolean
}