import { useParams } from "react-router-dom";
import { useSocket } from "../App";
import { useState, useEffect, useRef } from "react";
import { SendIcon } from "lucide-react";
import { useRecoilValue } from "recoil";
import { socketIdAtom, usernameAtom } from "../atom/atoms";

export default function Room() {
    const { getRoommsg, sendMsgToRoom } = useSocket();
    const { roomId } = useParams();
    const [data, setData] = useState(null);
    const msgRef = useRef()
    const username = useRecoilValue(usernameAtom)

    useEffect(() => {
        const handleRoomData = (data) => {

            setData(data)
        }
        getRoommsg(roomId, handleRoomData)
    }, [roomId])

    const handleMsgSend = () => {
        sendMsgToRoom(roomId, { username, msg: msgRef.current.value })
    }


    return <div className="h-screen bg-amber-100" >
        <div className="w-full py-2 flex justify-center" ><h1  >{"Welcome to " + roomId}</h1></div>
        <div className="flex overflow-y-scroll h-[80vh] flex-col gap-5 bg-amber-100 w-full p-10 justify-full items-end" >
            {data ? data.map((data, ind) => <MsgDisplay key={ind}  {...data} />) : <p>loading...</p>}
            <div className="flex gap-2" >
                <p className="opacity-85 text-sm" >{username.slice(0, 5) + '...'}</p>
                <input ref={msgRef} className="rounded-full px-4  py-1 bg-zinc-300" name="message" placeholder="message" />
                <button onClick={handleMsgSend} className="flex hover:scale-110 items-center justify-center cursor-pointer" ><SendIcon size={20} /></button>
            </div>
        </div>

    </div>;
}


const MsgDisplay = ({ username, id, msg }) => {
    const socketId = useRecoilValue(socketIdAtom)

    return (<div className={`flex flex-col gap-1 w-full ${socketId === id ? "items-end" : "items-start"}`} >
        <p className="text-black opacity-60 text-sm" >{username.slice(0, 5) + '...'}</p>
        <p className="bg-zinc-300 w-fit  border border-black  rounded-full text-black py-1 px-10" >{msg}</p>
    </div>)
}