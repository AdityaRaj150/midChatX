import { useRef } from "react"

export function Modal({ text, handleClick }) {
    const inputRef = useRef()
    return (<dialog className="p-4 flex flex-col gap-4 rounded bg-zinc-100" open >
        <h3>{text}</h3>
        <div className="flex gap-2" >
            <input ref={inputRef} className="rounded py-1 px-2" placeholder="name" />
            <button onClick={() => handleClick(inputRef.current.value)} className="py-1 hover:scale-105 active:scale-95 px-4 rounded-full bg-green-200 " >create</button>
        </div>
    </dialog>)
}