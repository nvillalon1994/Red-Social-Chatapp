import React from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { auth } from '../config/firebase'
import {signOut} from 'firebase/auth'
import { BiLogOutCircle } from 'react-icons/bi';
import { AiFillBell } from 'react-icons/ai';
import {useRouter} from 'next/router'

export default function Navbar() {
    const auth2 = useSelector(state=>state.auth)
    const router = useRouter()
    const logout=()=>{
      signOut(auth)
      router.replace("/login")
    }
    console.log(auth2.user.name)
    return (
        <nav className='bg-color1-nav p-5  shadow-lg  min-h-16 h-16'>
            
            <ul className='flex items-center gap-5 text-white justify-between max-w-6xl m-auto'>
                <li className='logo'><Link href="/" >aplication</Link></li>
                {!auth2.logged&&<li><Link href="/login">Login</Link></li>}
                {auth2.logged&&
                <div className='flex gap-3 items-center'>
                  
                  < AiFillBell className='text-2xl'/>
                  <div className='flex gap-3 items-center w-8 h-8 rounded-full overflow-hidden'>
                  <Link href={"/" + auth2.user.id}><img className='h-8' src={auth2.user.profilePic} alt="" /></Link>
                        
                  </div>
                  {/* <div className='w-8 h-8 overflow-hidden rounded-full flex items-center'>
                    
                    <Link href={"/" + auth2.user.id}><img className='h-8  rounded-full' src={auth2.user.profilePic} alt="" /></Link>
                    
                    
                  </div> */}
                  
                  
                  
                  
                  < BiLogOutCircle onClick={logout} className='text-2xl'/>
                  
                  
                  
                  
                </div>}

            </ul>
        </nav>
  )
}