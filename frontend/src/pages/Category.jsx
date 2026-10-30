import React from 'react'
import { useParams } from 'react-router-dom'
import Home from './Home'

const Category = () => {
  const { categoryId } = useParams()
  return <Home categoryFilter={categoryId || 'all'} />
}

export default Category
