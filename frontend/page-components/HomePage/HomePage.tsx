"use client"
import Banner from '@/components/section/Home/Banner'
import Blogs from '@/components/section/Home/Blogs'
import Category from '@/components/section/Home/Category'
import CTA from '@/components/section/Home/CTA'
import Featured from '@/components/section/Home/Featured'
import LatestProperties from '@/components/section/Home/LatestProperties'
import Testimonal from '@/components/section/Home/Testimonal'
import WhyChooseUs from '@/components/section/Home/WhyChooseUs'

const HomePage = () => {
  return (
    <div>
      <Banner/>
      <Featured/>
      <Category/>
      <WhyChooseUs/>
      <LatestProperties/>
      <Testimonal/>
      <Blogs/>
      <CTA/>
    </div>
  )
}

export default HomePage