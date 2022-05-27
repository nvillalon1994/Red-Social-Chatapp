import React from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { auth } from '../config/firebase'
import {signOut} from 'firebase/auth'
import { BiLogOutCircle } from 'react-icons/bi';
import { AiFillBell } from 'react-icons/ai';
export default function Navbar() {
    const auth2 = useSelector(state=>state.auth)
    const logout=()=>{
      signOut(auth)
    }
    return (
        <nav className='bg-color1-nav p-5  shadow-lg'>
            
            <ul className='flex items-center gap-5 text-white justify-between max-w-6xl m-auto'>
                <li><Link href="/">Home</Link></li>
                {!auth2.logged&&<li><Link href="/login">Login</Link></li>}
                {auth2.logged&&
                <div className='flex gap-3 items-center'>
                  
                  < AiFillBell className='text-2xl'/>
                  <div className='w-8 h-8 overflow-hidden rounded-full flex items-center'>
                    
                    <img className='w-10 h-10  rounded-full' src={auth2.user.profilePic} alt="" />
                    
                  </div>
                  
                  
                  
                  < BiLogOutCircle onClick={logout} className='text-2xl'/>
                  
                  
                  
                  
                </div>}

            </ul>
        </nav>
  )
}