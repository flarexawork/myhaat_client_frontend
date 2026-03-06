import React, { useEffect, useState } from 'react'
import Headers from '../components/Headers'
import Footer from '../components/Footer'
import RazorpayCheckout from '../components/RazorpayPayment'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { api_url } from '../utils/config'
import { useSelector } from 'react-redux'

const Payment = () => {

    const navigate = useNavigate()
    const { userInfo } = useSelector((state) => state.auth)
    const location = useLocation()
    const price = Number(location.state?.price || 0)
    const items = Number(location.state?.items || 0)
    const orderId = location.state?.orderId || ""

    const [paymentMethod, setPaymentMethod] = useState('online')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!userInfo) {
            navigate('/login', { replace: true })
            return
        }
        if (!orderId) {
            navigate('/card', { replace: true })
        }
    }, [userInfo, orderId, navigate])

    /* -------------------------
       COD HANDLER
    -------------------------- */

    const handleCOD = async () => {
        if (!userInfo) {
            navigate('/login', { replace: true })
            return
        }

        if (!orderId) {
            navigate('/card', { replace: true })
            return
        }

        try {
            setLoading(true)

            await axios.put(
                `${api_url}/api/order/cod-confirm/${orderId}`,
                {},
                { withCredentials: true }
            )

            navigate(`/order/success/${orderId}`)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>

            <Headers />

            <section className='bg-[#f4f4f4]'>

                <div className='max-w-[1200px] mx-auto px-6 py-12 mt-4'>

                    <div className='flex flex-wrap md:flex-col-reverse gap-6'>

                        {/* LEFT SIDE - PAYMENT METHODS */}
                        <div className='w-7/12 md:w-full'>

                            <div className='bg-white shadow rounded-md'>

                                {/* METHOD TABS */}
                                <div className='flex border-b'>

                                    <div
                                        onClick={() => setPaymentMethod('online')}
                                        className={`w-1/2 cursor-pointer py-6 text-center font-medium ${paymentMethod === 'online'
                                                ? 'bg-white text-green-600 border-b-2 border-green-600'
                                                : 'bg-gray-100'
                                            }`}
                                    >
                                        Razorpay (Online)
                                    </div>

                                    <div
                                        onClick={() => setPaymentMethod('cod')}
                                        className={`w-1/2 cursor-pointer py-6 text-center font-medium ${paymentMethod === 'cod'
                                                ? 'bg-white text-green-600 border-b-2 border-green-600'
                                                : 'bg-gray-100'
                                            }`}
                                    >
                                        Cash On Delivery
                                    </div>

                                </div>

                                {/* PAYMENT BODY */}
                                <div className='p-6'>

                                    {paymentMethod === 'online' && (
                                        <RazorpayCheckout
                                            orderId={orderId}
                                            price={price}
                                        />
                                    )}

                                    {paymentMethod === 'cod' && (
                                        <div className='flex flex-col gap-4'>

                                            <p className='text-slate-600'>
                                                Pay when your order is delivered.
                                            </p>

                                            <button
                                                onClick={handleCOD}
                                                disabled={loading}
                                                className='px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition'
                                            >
                                                {loading ? 'Processing...' : 'Confirm COD Order'}
                                            </button>

                                        </div>
                                    )}

                                </div>

                            </div>

                        </div>

                        {/* RIGHT SIDE - ORDER SUMMARY */}
                        <div className='w-5/12 md:w-full'>

                            <div className='bg-white shadow rounded-md p-6 flex flex-col gap-4'>

                                <h2 className='text-lg font-semibold text-slate-700'>
                                    Order Summary
                                </h2>

                                <div className='flex justify-between text-slate-600'>
                                    <span>{items} items (shipping included)</span>
                                    <span>₹{price}</span>
                                </div>

                                <div className='flex justify-between font-semibold text-lg'>
                                    <span>Total</span>
                                    <span className='text-green-600'>
                                        ₹{price}
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            <Footer />

        </div>
    )
}

export default Payment
