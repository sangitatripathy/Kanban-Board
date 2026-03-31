import React from 'react'

const FeatureCard = ({icon,title,description}) => {
  return (
    <div className='bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100'>
      <div className='w-12 h-12 flex items-center justify-center bg-blue-100 rounded-xl mb-4'>{icon}</div>
      <h2 className='text-lg font-semibold mb-2'>{title}</h2>
      <p className='text-gray-500 text-sm text-wrap'>{description}</p>
    </div>
  )
}

export default FeatureCard