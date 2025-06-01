import { IoMicOff } from "react-icons/io5";

const UserVoiceChatCard = ({ userName, userPhoto, isMuted, isSpeaking }: { userName: string, userPhoto: string, isMuted: boolean; isSpeaking: boolean })  => {

    return (
        <div className={`flex flex-col relative items-center justify-center gap-6 p-6 bg-cyan-300 
        border-4 rounded-2xl shadow-xl w-72 h-40 transition-all duration-300
        ${isSpeaking && 'border-green-500 shadow-[0_0_15px_rgba(0,255,0,0.6)]'}
        `}>

            <div className='w-16 h-16 rounded-full bg-gray-800 overflow-hidden'>
                <img
                    src={userPhoto}
                    alt={`${userName}'s avatar`}
                    className='w-full h-full object-cover'
                />
            </div>

            <div className='flex gap-2 items-center absolute left-2 bottom-2 bg-gray-700 px-2 py-1 rounded-md text-white'>
                {isMuted && <IoMicOff size={20} />}
                <span className=' text-sm'>{userName}</span>
            </div>
        </div>
    )
}

export default UserVoiceChatCard