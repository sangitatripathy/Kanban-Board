import React from 'react'
import {useParams} from 'react-router-dom';

const VerifyInvitation = () => {
  const {token} = useParams()
  return (
    <div>VerifyInvitation</div>
  )
}

export default VerifyInvitation