import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { AiOutlineLike } from 'react-icons/ai';
import { FaComment,FaRegComment } from 'react-icons/fa';
import { useSelector } from 'react-redux';
export default function Home() {
  const auth = useSelector(state=>state.auth)
  return (
    <main className=' max-w-6xl m-auto'>
      <section className='flex justify-between'>
        <section className='w-52  h-fit'>
          <p>Grupos</p>
          <p>Familia</p>
          <p>Futbol</p>
          <p>Secundaria</p>
        </section>
        <section className='w-full '>
          
          <article className='max-w-xl m-auto bg-color3-publicacion p-5 rounded-lg shadow-xl shadow-black my-8'>
            <div className='flex items-center gap-2 mb-3'>
            <div className='w-10 h-10 overflow-hidden rounded-full flex items-center'>
                    
                    <img className='w-20 mt-2' src={"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387"} alt="" />
                    
                  </div>
              <p className='text-sm'>Agustin Prieto</p>
              <p className='text-gray-500 text-sm'>9h</p>
              
            </div>
            <p className='mb-2'>Buen Partido</p>
            <img className='rounded-md' src={"https://images.unsplash.com/photo-1508098682722-e99c43a406b2?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870"}/>
            <article className='flex gap-4 m-2'>
              <div><AiOutlineLike className='text-2xl'/></div>
              <div><FaRegComment className='text-2xl'/></div>
            </article>
            <article className='bg-color4-comentarios rounded-md p-2'>
              <article className='flex items-center gap-2 mb-2'>
                  <div className='w-10 h-10 overflow-hidden rounded-full flex items-center'>
                    
                    <img className='w-20' src={"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387"} alt="" />
                    
                  </div>
                  <div className='w-full'>
                    <p className='text-xs '>Fabio Tovar</p>
                    <p className='ml-2 '>Fue un muy buen partido</p>
                    <p className='ml-2 text-xs text-shadow-sm   text-white    w-16 rounded-sm'>Responder</p>
                    
                  </div>
                  
              </article>
              
              
              

            </article>
          </article>
          <article className='max-w-xl m-auto bg-color3-publicacion p-5 rounded-lg shadow-xl shadow-black my-8'>
            <div className='flex items-center gap-2 mb-3'>
            <div className='w-10 h-10 overflow-hidden rounded-full flex items-center'>
                    
                    <img className='w-20' src={"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387"} alt="" />
                    
                  </div>
              <p className='text-sm'>Agustin Prieto</p>
              <p className='text-gray-500 text-sm'>9h</p>
              
            </div>
            <p className='mb-2'>Buen Partido</p>
            <img className='rounded-md' src={"https://images.unsplash.com/photo-1508098682722-e99c43a406b2?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870"}/>
            <article className='flex gap-4 m-2'>
              <div><AiOutlineLike className='text-2xl'/></div>
              <div><FaRegComment className='text-2xl'/></div>
            </article>
            <article className='bg-color4-comentarios rounded-md p-2'>
              <article className='flex items-center gap-2 mb-2'>
                  <div className='w-10 h-10 overflow-hidden rounded-full flex items-center'>
                    
                    <img className='w-20' src={"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387"} alt="" />
                    
                  </div>
                  <div className='w-full'>
                    <p className='text-xs '>Fabio Tovar</p>
                    <p className='ml-2 '>Fue un muy buen partido</p>
                    <p className='ml-2 text-xs text-shadow-sm   text-white    w-16 rounded-sm'>Responder</p>
                    
                  </div>
                  
              </article>
              
              
              

            </article>
          </article>
          
        </section>
        <section className='w-52  h-fit'>
          <p>contactos</p>
        </section>
      </section>
    </main>
  )
}
