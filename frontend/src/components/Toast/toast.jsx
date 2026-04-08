import React from 'react'

const toast = ({message}) => {
  return (
    <div className='inset-0'>
      <div className='fixed top-5 right-4'>
        {message}
      </div>
    </div>
  )
}

export default toast