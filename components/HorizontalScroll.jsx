import React, { useRef } from 'react'
import Cart from "@/components/Cart";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from 'next/link';
import LoadingSpinner from './LoadingSpinner';

const HorizontalScroll = ({ data = [], heading, trending, media_type }) => {

  const containerRef = useRef();

  const handleScroll = (scrollOffset) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ // Use scrollBy for smoother relative scrolling
        left: scrollOffset,
        behavior: 'smooth' // Let scrollBy handle the smooth behavior
      });
    }
  };


  return (
    <section className="container mx-auto px-8 my-10">
      <h2 className="text-xl lg:text-3xl font-bold mb-4"> {heading} </h2>

      <div className=" relative group">
        <div
          className="flex overflow-x-scroll gap-6 scrollbar-hide py-4"
          ref={containerRef}
        >
          {data.map((item, index) => {

            if (!item || !item.id) return null;

            if (!media_type || !item.id) {
              console.warn(`HorizontalScroll (${heading}): Skipping item without id or mediaType`, item);
              return null;
            }

            const detailUrl = `/${media_type}/${item.id}`;


            return (
              <Link href={detailUrl} key={item.id + '-' + heading} className='flex-shrink-0'>

                  <Cart
                    
                    data={item}
                    index={index + 1}
                    trending={trending}
                    media_type={media_type}
                  />
              </Link>
            )
          })}
        </div>

        <div className='absolute top-0 left-0 right-0 bottom-0 hidden lg:flex items-center justify-between pointer-events-none'>
          <button
            className='text-[#F17FFF] bg-black/20 hover:bg-black/50 rounded-full p-2 backdrop-blur-sm shadow-md hover:text-[#F17FFF] hover:cursor-pointer z-10 transition-all duration-300 hover:scale-110 pointer-events-auto absolute -left-3 top-1/2 -translate-y-1/2'
            onClick={() => handleScroll(-460)}
            aria-label='Scroll previous'
          >
            <FaChevronLeft />
          </button>
          <button
            className='text-[#F17FFF] bg-black/20 hover:bg-black/50 rounded-full p-2 backdrop-blur-sm shadow-md hover:text-[#F17FFF] hover:cursor-pointer z-10 transition-all duration-300 hover:scale-110 pointer-events-auto absolute -right-3 top-1/2 -translate-y-1/2 '
            onClick={() => handleScroll(+460)}
            aria-label='Scroll next'
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

    </section>
  )
}

export default HorizontalScroll;
