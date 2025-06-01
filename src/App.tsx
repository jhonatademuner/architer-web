import { useEffect, useRef, useState } from 'react'
import './App.css'

import UserVoiceChatCard from './components/UserVoiceChatCard'

function App() {
	const [isUserMuted, setIsUserMuted] = useState(false)
	const [isUserSpeaking, setIsUserSpeaking] = useState(false)
	const [isInterviewerMuted] = useState(false)
	const [isInterviewerSpeaking] = useState(false)
	const audioContextRef = useRef<AudioContext | null>(null)
	const analyserRef = useRef<AnalyserNode | null>(null)
	const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
	const mediaStreamRef = useRef<MediaStream | null>(null)

	useEffect(() => {
		const initAudio = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
				mediaStreamRef.current = stream

				const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
				audioContextRef.current = audioContext

				const source = audioContext.createMediaStreamSource(stream)
				sourceRef.current = source

				const analyser = audioContext.createAnalyser()
				analyser.fftSize = 512
				analyserRef.current = analyser

				source.connect(analyser)

				const dataArray = new Uint8Array(analyser.frequencyBinCount)

				const detectSpeech = () => {
					if (!analyserRef.current) return
					analyserRef.current.getByteFrequencyData(dataArray)

					const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
					setIsUserSpeaking(volume > 20)

					requestAnimationFrame(detectSpeech)
				}

				detectSpeech()
			} catch (err) {
				console.error('Error accessing microphone:', err)
			}
		}

		initAudio()

		return () => {
			mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
			audioContextRef.current?.close()
		}
	}, [])

	const toggleMute = () => {
		const stream = mediaStreamRef.current
		if (stream) {
			stream.getAudioTracks().forEach((track) => {
				track.enabled = isUserMuted
			})
			setIsUserMuted(!isUserMuted)
		}
	}

	return (
		<div className='flex flex-col items-center justify-start w-96 p-6 bg-[#2b2d31] text-white font-sans'>
			<h1 className='text-2xl font-bold text-[#f2f3f5]'>Archter Interviewer</h1>

			<div className='flex flex-col items-center gap-6 w-full'>


				<UserVoiceChatCard userName='Archter' userPhoto='https://ui-avatars.com/api/?name=Archter&background=5865f2&color=fff' isMuted={isInterviewerMuted} isSpeaking={isInterviewerSpeaking} />

				<UserVoiceChatCard userName='You' userPhoto='https://ui-avatars.com/api/?name=User&background=5865f2&color=fff' isMuted={isUserMuted} isSpeaking={isUserSpeaking} />

				<button
					onClick={toggleMute}
					className='bg-[#5865f2] hover:bg-[#4752c4] text-white px-6 py-2 rounded-full font-medium transition-all duration-200'
				>
					{isUserMuted ? 'Unmute' : 'Mute'}
				</button>

			</div>

		</div>
	)
}

export default App
