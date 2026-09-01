import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Heders from '../components/Headers'
import Banner from '../components/Banner'
import Categorys from '../components/Categorys'
import FeatureProducts from '../components/products/FeatureProducts'
import Products from '../components/products/Products'
import Footer from '../components/Footer'
import { get_products } from '../store/reducers/homeReducer'
const Home = () => {
    const dispatch = useDispatch()
    const {products, latest_product, topRated_product, discount_product, productsLoading } = useSelector(state => state.home)
    useEffect(() => {
        dispatch(get_products())
    }, [dispatch])
    return (
        <div className='w-full'>
            <Heders />
            <Banner />
            <div className='my-4 max-w-[1440px] mx-auto px-16 sm:px-5 md-lg:px-12 md:px-10'>
                <Categorys />
            </div>
            <div className='py-[45px] max-w-[1440px] mx-auto px-16 sm:px-5 md-lg:px-12 md:px-10'>
                <FeatureProducts products={products} loading={productsLoading} infinite />
            </div>
            <section className='py-12 bg-gradient-to-b from-[#fff9f4] to-white border-y border-[#f3e3d8]'>
                <div className='max-w-[1440px] mx-auto px-16 sm:px-5 md-lg:px-12 md:px-10'>
                    <div className='mb-7 flex items-end justify-between md:flex-col md:items-start md:gap-2'>
                        <div>
                            <span className='inline-flex items-center px-3 py-1 rounded-full border border-[#f7d9c8] bg-[#fff3ea] text-[11px] font-semibold uppercase tracking-wider text-[#c2410c]'>
                                Curated Collections
                            </span>
                            <h2 className='text-3xl md:text-2xl font-bold text-slate-800 mt-3'>
                                Latest, Top Rated & Discount Picks
                            </h2>
                        </div>
                        <p className='text-sm text-slate-500 max-w-[360px] md:max-w-full'>
                            Explore new arrivals, best loved products and trending offers in one place.
                        </p>
                    </div>

                    <div className="grid w-full grid-cols-3 md-lg:grid-cols-2 md:grid-cols-1 gap-6">
                        <div className='overflow-hidden'>
                            <Products title='Latest Product' products={latest_product} loading={productsLoading} />
                        </div>
                        <div className='overflow-hidden'>
                            <Products title='Top Rated Product' products={topRated_product} loading={productsLoading} />
                        </div>
                        <div className='overflow-hidden'>
                            <Products title='Discount Product' products={discount_product} loading={productsLoading} />
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default Home
