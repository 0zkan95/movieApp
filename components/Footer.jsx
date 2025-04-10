"use client"
import Link from 'next/link'
import React from 'react'
import { FaRegCopyright } from "react-icons/fa6";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className='lg:flex items-center justify-between mx-12 lg:mb-4 mb-13 p-2 text-[#F17FFF]'>
      <div className='flex items-center justify-center gap-4'>
        <Link href="/about"> About</Link>
        <Link href="/contact" > Contact</Link>
      </div>
      <div className='flex items-center justify-center gap-4'>
        <p>Created By Aytekin  </p>
        <p className='flex items-center'> Copyrights  <FaRegCopyright /> {year} </p>
      </div>

    </footer>
  )
}

export default Footer
