import React, { useEffect, useState, useContext } from 'react';
import SideBar from '../Component/SideBar';
import { motion } from 'framer-motion';
import { ScrapContext } from '../Context/ScrapContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { socket } from '../socket';

const AllScrap = () => {
  const [show, setShow] = useState(null);
  const [status ,setStatus]=useState('Pending')
  const [scrap, setSCrap] = useState([]);
  const [shopName, setShopName] = useState('');
  const [bit, setBit] = useState(0);
  const [exloding,setExloding]=useState(false)
  const[location,setLocation]=useState({lat:null,lng:null})
  // const [allbit,setAllBit]=useState([])
  const [allbit, setAllBit] = useState([])
  
  const { token, backendUrl, userRole ,user, navigate} = useContext(ScrapContext);

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(
      (pos)=>{
      
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setLocation(coords)
  
      }
    )
  },[location])


  useEffect(()=>{
    if(token === ''){
      navigate('/Registor')
    }
  },[])
  

  

  useEffect(() => {
    const handleNewBit = (setBit) => {
      // setAllBit((prev) => {
      //   const existingIds = new Set(prev.map((bit) => bit._id));
      //   const newBits = setBit.filter((b) => !existingIds.has(b._id));
      //   return [...prev, ...newBits];
      // });

      setAllBit(setBit)
      
      console.log(allbit.length ===0)
      
    }
    

    socket.emit('get-status',{
      token
    })

    socket.on('set-status',({status})=>{
      setStatus(status)
    })
  
    socket.on('send-bit', handleNewBit)

    socket.on('bit-success',({setBit})=>{
      setAllBit(setBit)
      toast.success('cmfvofmoi');
      setTimeout(() => {
        window.location.reload(); // 🔁 page will now reload correctly
      }, 1000);
      
    })
   
    socket.on('error-bit',({msg})=>{
      toast.error(msg);
    })
    socket.on('bit-reject',(notRejectBit)=>{
      setAllBit(notRejectBit)
      console.log(allbit.length)
      toast.success('rejected success')
    })
    socket.on('bit-deleted', ({id})=>{
    
    setSCrap(prev => prev.filter(item => item._id !== id));
    setExloding(true)
    }); 
  
    return () => {
      socket.off('send-bit', handleNewBit)
      // socket.off('bit-deleted', handleDeleteBit); 
      socket.off('bit-success');
    socket.off('error-bit');
    socket.off('bit-reject')
    socket.off('bit-deleted')
    }
  }, [allbit,status,scrap])
  

  const bitSubmit = async (e, scrapId) => {
    try {
      e.preventDefault();
      socket.emit('sub-bit',{
        token,
        scrapId,
        shopName,
        bit

      })
   
      
     
     
    } catch (e) {
      toast.error(e.message);
    }
  };


  

  
  const handleShow=async (scrapId)=>{
    try{
    const toggle=show === scrapId ? null : scrapId
      setShow(toggle)

      socket.emit('sendId',{
        scrapId
      })
    // if(toggle !==null){
    //   console.log(scrapId)
    //   const response=await axios.get(`${backendUrl}/scrap/allbit/${scrapId}`,{
    //     headers:{token}
    //   })
    //   console.log(response.data)
    // }}
    }
    catch(err){
      toast.error(err.message)
    }
  }
  useEffect(() => {
    if (!location.lat || !location.lng) return; 
   
   console.log(userRole)
    const fetchSCrap = async () => {
      try {
        const endpoint =
          userRole === 'dealer'
            ? `${backendUrl}/scrap/allscrap?lat=${location.lat}&lng=${location.lng}`
            : `${backendUrl}/scrap/userscrap`;

        const response = await axios.get(endpoint, {
          headers: { token },
        });
        console.log(response.data)

        if (response.data.success === true) {
          // console.log(location)
          setSCrap(response.data.scrap);
        }
      } catch (e) {
        toast.error("Error fetching scrap: " + e.message);
      }
    };

    fetchSCrap();
  }, [location.lat,location.lng,userRole, backendUrl, token]);


  
  //acept and reject with socket 

  const Reject=(lat,lng,bitid)=>{

    socket.emit('send-reject-request',{
      lat,
      lng,
      bitId:bitid
    })
  }

  const Accept=async(lat,lng,bitid)=>{

   
      setExloding(true)
   
    socket.emit('send-accept-request',{
      lat,
      lng,
      bitId:bitid
    })
  }




  return (
    <div className="pb-32 bg-gradient-to-b from-slate-100 to-slate-300 flex flex-col items-center min-h-screen relative">
      <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-400 to-green-500 relative inline-block pb-2 after:absolute after:left-0 after:bottom-0 after:h-[4px] after:w-full after:bg-orange-500 after:rounded-full hover:after:w-0 hover:after:opacity-0 transition-all duration-500 animate-fade-in-up">
        Scrap
      </h1>

      {scrap.length === 0 ? (
        <h2 className="text-3xl font-poppins flex self-center">No scrap available here</h2>
      ) : (
        scrap.map((scrapItem, i) => (
          <React.Fragment key={i}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="mt-14 w-[90vw] max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
            >
              <img
                src={scrapItem.image}
                className="w-full h-60 object-cover hover:scale-105 transition-transform duration-500 ease-in-out"
                alt="Scrap Image"
              />
              <div className="p-5">
                <p className="text-lg font-semibold font-poppins text-gray-800 mb-1">
                  Type: <span className="text-orange-500">{scrapItem.Type}</span>
                </p>
                <p className="text-lg font-semibold font-poppins text-gray-800 mb-2">
                  Weight: <span className="text-orange-500">{scrapItem.weight}</span>
                </p>
                <p className="text-sm text-gray-600 font-poppins">{scrapItem.des}</p>

                {
                userRole ==='coustomer'?(
                  <motion.button
                    onClick={() =>
                      handleShow(scrapItem._id)
                    }
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: '#f97316',
                      boxShadow: '0 10px 20px rgba(249, 115, 22, 0.3)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="mt-6 w-full h-11 bg-orange-500 rounded-xl font-poppins text-white text-md shadow-md transition-all duration-300"
                  >
                    {show === scrapItem._id ? 'Hide Bid' : 'Show Bid'}
                  </motion.button>
                ):(
               (scrapItem.bit.length > 0 && scrapItem.bit.some(b => b.user === user._id)) ? (
                (() => {
                  const userBit = scrapItem.bit.find(b => b.user === user._id);
                  return (
                    <p className={`mt-2 text-xl font-poppins font-bold ${userBit.bitStatus === 'Reject' ? 'text-red-600' : 'text-gray-500'}`}>
                      {userBit.bitStatus}
                    </p>
                  );
                })()
              ) : (
                  <motion.button
                    onClick={() =>
                      handleShow(scrapItem._id)
                    }
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: '#f97316',
                      boxShadow: '0 10px 20px rgba(249, 115, 22, 0.3)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="mt-6 w-full h-11 bg-orange-500 rounded-xl font-poppins text-white text-md shadow-md transition-all duration-300"
                  >
                    {show === scrapItem._id ? 'Hide Bid' : 'Show Bid'}
                  </motion.button>
                )
                )}

                {/* Bid Form or Display */}
                {userRole === 'dealer' ? (
                  (show === scrapItem._id && scrapItem.bit.length===0) && (
                    <form
                      onSubmit={(e) => bitSubmit(e, scrapItem._id)}
                      className="ml-10"
                    >
                      <input
                        required
                        onChange={(e) => setShopName(e.target.value)}
                        type="text"
                        value={shopName}
                        placeholder="Shop Name"
                        className="mt-9 ml-7 pl-3 w-[81%] h-12 outline-none text-gray-400 font-poppins font-medium border border-gray-300 rounded-lg shadow-gray-300 shadow-lg"
                      />
                      <input
                        required
                        onChange={(e) => setBit(Number(e.target.value))}
                        type="number"
                        value={bit}
                        placeholder="Bid"
                        className="mt-9 ml-7 pl-3 w-[81%] h-12 outline-none text-gray-400 font-poppins font-medium border border-gray-300 rounded-lg shadow-gray-300 shadow-lg"
                      />
                      <button className="mt-6 ml-5 pl-3 w-[81%] h-12 bg-emerald-500 text-white font-poppins font-medium border rounded-md shadow-gray-200 shadow-lg">
                        Send Request
                      </button>
                    </form>
                  )
                ) : scrapItem.bit.length > 0 && scrapItem.bit.bitStatus!=='Reject' && show === scrapItem._id ? (

                  <motion.div
                 

                  
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-5 space-y-3"
                  >
                     {allbit.length>0 &&( 
                     allbit
  .filter((bit) => bit.bitStatus !== 'Reject') // 🔍 Filter out rejected bids
  .map((bit) => (
    <React.Fragment key={bit._id}>
      <p className="font-poppins text-gray-800">
        Shop Name:{' '}
        <span className="font-bold text-pink-500">{bit.shopName}</span>
      </p>
      <p className="font-poppins text-gray-800">
        Bid Price:{' '}
        <span className="font-bold text-green-600">₹{bit.bitAmount}</span>
      </p>

      <div className="flex gap-4 mt-3">
        <motion.button
          onClick={() =>
            Accept(scrapItem.location.coordinates[0], scrapItem.location.coordinates[1], bit._id)
          }
          whileTap={{ scale: 0.95 }}
          className="flex-1 h-9 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow-md transition-all"
        >
          {exloding ===true?'Loading.....':'Accept'}
        </motion.button>
        <motion.button
          onClick={() =>
            Reject(scrapItem.location.coordinates[0], scrapItem.location.coordinates[1], bit._id)
          }
          whileTap={{ scale: 0.95 }}
          className="flex-1 h-9 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow-md transition-all"
        >
          Reject
        </motion.button>
      </div>
    </React.Fragment>
  )))}

                  </motion.div>
                ) : (
                  ( allbit.length ===0) && (
                    <p className="mt-4 text-sm font-poppins text-gray-500 italic">
                      No bids available for this scrap item.
                    </p>
                  )
                )}
              </div>
            </motion.div>
          </React.Fragment>
        ))
      )}

      <SideBar />
    </div>
  );
};

export default AllScrap;
