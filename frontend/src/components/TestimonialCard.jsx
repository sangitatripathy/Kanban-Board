import React from 'react'

const TestimonialCard = ({description,name,designation,image}) => {
  return (
    <div className="w-100 flex flex-col gap-3 px-5 py-4 shadow-lg rounded-lg">
      <div className="flex flex-col gap-3">
        <p>⭐⭐⭐⭐⭐</p>
        <p className='text-gray-700'>{description}</p>
      </div>
      <div className="flex gap-3">
        <img className="w-15 h-15 rounded-full object-cover" src={image} alt="" />
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-s text-gray-500">{designation}</p>
        </div>
      </div>
    </div>
  )
}

export default TestimonialCard