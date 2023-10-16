import React from 'react'
import {Image} from 'react-native'
import Images from '../assets/index'

const Tick = () => {
  return <Image source={Images.tick} style={{width: 10, height: 10, resizeMode: 'contain'}}/>
}

export default Tick