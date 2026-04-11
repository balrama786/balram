import AddTestimonialPage from '@/src/components/testimonial/AddTestimonialPage'
import React from 'react'

const EditTestimonial = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <AddTestimonialPage id={id} />
  )
}

export default EditTestimonial
