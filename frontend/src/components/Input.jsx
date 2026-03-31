import React from 'react'

const Input = ({
  label,
  type="text",
  name,
  icon:Icon,
  placeholder,
  onChange,
  error,
  value
}) => {
  return (
    <div className='flex flex-col gap-1 my-4'>
      {label && (
        <label className='text-sm font-medium text-gray-800'>{label}</label>
      )}
      <div className='flex gap-2 border border-gray-200 px-4 py-2 rounded-lg sm:w-100'>
        {Icon && <Icon className='text-gray-400'/>}
        <input 
        type={type}
        name={name}
        placeholder={placeholder} 
        onChange={onChange}
        value={value}
        className='outline-none bg-transparent w-full'/>
      </div>
      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}
    </div>
  )
}

export default Input