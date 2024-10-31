import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { allRoomAtom, socketIdAtom, usernameAtom } from './atom/atoms';
import { useEffect, useRef, useState } from 'react';
import { Modal } from './components/Modal';
import { DeleteIcon } from 'lucide-react';

let socket = null;
export const useSocket = () => {
    const navigate = useNavigate()
    const setSocketId = useSetRecoilState(socketIdAtom)
    if (!socket) {
        socket = io("http://localhost:3000");
        socket.on("connect", () => {
            navigate("/")
            console.log("Connected to WebSocket in useSocket");
            setSocketId(socket.id)
        });
        socket.on("disconnect", () => {
            console.log("disconnected from websockets");
        })
    }

    const connectSocket = (room, setSocketId) => {
        if (socket) {
            socket.emit("join-room", room);
            setSocketId(socket.id)
        }
    };

    const getRoommsg = (room, onDataReceived) => {
        if (socket) {
            socket.on(room, (data) => {
                onDataReceived(data)
            });
        }
    };

    const sendMsgToRoom = (room, msg) => {
        if (socket) {
            socket.emit("room-msg-from-client", { room, msg })
        }
    }

    const createNewRoom = (roomName) => {
        if (socket) {
            socket.emit("create-room", roomName)
        }
    }

    const getAllRooms = (setAllRooms) => {
        if (socket) {
            socket.on("fetch-room", allRooms => {
                setAllRooms(allRooms)
            })
        }
    }

    const deleteRoom = (room) => {
        if (socket) {
            socket.emit("delete-room", room);
        }
    }

    return {
        connectSocket,
        getRoommsg,
        sendMsgToRoom,
        createNewRoom,
        getAllRooms,
        deleteRoom
    };
}


function App() {
    console.log("app rendering")
    const [username, setUsername] = useRecoilState(usernameAtom)
    const navigate = useNavigate()
    const [createRoomModal, setCreateRoomModal] = useState(false)
    const { connectSocket, createNewRoom, getAllRooms, deleteRoom } = useSocket()
    const [allRooms, setAllRooms] = useRecoilState(allRoomAtom)
    const usernameRef = useRef()
    const setSocketId = useSetRecoilState(socketIdAtom)
    console.log(allRooms)
    useEffect(() => {
        getAllRooms(setAllRooms)
    }, [])


    const handleClick = (room) => {
        connectSocket(room, setSocketId)
        navigate("/room/" + room)
    }

    const handleButtonClick = () => {
        setUsername(usernameRef.current.value)
    }

    const createRoom = () => {
        setCreateRoomModal(true)
    }

    const createRoomDone = (roomName) => {
        setCreateRoomModal(false)
        createNewRoom(roomName)

    }

    console.log("before anyting else " + JSON.stringify(allRooms))

    return (<div className='bg-gradient-to-t from-red-200 to-amber-200 flex min-h-screen flex-col gap-5 justify-center items-center'>
        {createRoomModal && <Modal handleClick={createRoomDone} text="create a room" />}
        {username === "" ? <dialog open >
            <div className='flex flex-col justify-center items-center' >
                <p>Enter your randi name</p>
                <input ref={usernameRef} className='border-2  py-2 px-6' placeholder='username' />
                <button onClick={handleButtonClick} className='hover:scale-110 hover:bg-amber-200 active:scale-95 duration-75 ease-linear cursor-pointer w-full rounded-sm bg-red-100 full' >ok</button>
            </div>

        </dialog> : <>
            <h1 className='text-3xl text-purple-700' >{"Welcome " + username}</h1>
            <h3 className='text-purple-400 text-pretty text-lg font-sans' >{"which room do you wanna join " + username}</h3>
            <div className='flex flex-col gap-2 '>
                {allRooms.map((roomData, ind) => <Room deleteRoom={deleteRoom} key={ind} {...roomData} handleClick={handleClick} />)}
            </div>
            <div>
                <button onClick={createRoom} className='bg-amber-200 py-2 px-6 rounded-3xl cursor-pointer hover:bg-amber-300 border border-black duration-100 ease-linear active:scale-95'  >create a room</button>
            </div></>}
    </div>)
}

export default App

const Room = ({ handleClick, room, host, roomId, deleteRoom }) => {
    const socketId = useRecoilValue(socketIdAtom)
    return <div className='flex gap-2'>
        <button className='bg-red-200 py-2 px-6 rounded-3xl cursor-pointer hover:bg-red-300 border border-black duration-100 ease-linear active:scale-95' onClick={() => handleClick(room)} >
            {room}
        </button>
        {socketId === host && <button onClick={() => deleteRoom(roomId)} className='cursor-pointer hover:scale-105' ><DeleteIcon /></button>}
    </div>
}


