import { Behavior } from './behavior'
import { Challenge } from './challenge'

export interface Interview {
  id?: string // UUID
  title: string
  timeSpent?: number // in seconds
  feedback?: string
  score?: number // 0–100
  messages: InterviewMessage[]
  behavior: Behavior
  seniority: string
  challenge: Challenge
}


export interface SimplifiedInterview {
  id: string
  title: string
  timeSpent?: number
  score?: number
  behaviorTitle: string
  challengeTitle: string
  seniority: string
  createdAt?: Date
}

export interface InterviewMessage {
  id?: string
  role: "user" | "assistant"
  content: string
  createdAt?: Date
};