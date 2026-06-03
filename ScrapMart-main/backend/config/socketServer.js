let ioInstance=null

export const  setSocketInstance=(io)=>{
ioInstance=io
}

export const getSocketInstance=()=>{
    if (!ioInstance) {
        throw new Error("Socket.IO instance not initialized yet!")
      }
      return ioInstance
}