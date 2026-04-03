import {
    createSlice,
    createAsyncThunk
} from '@reduxjs/toolkit'
import api from '../../api/api'

export const place_order = createAsyncThunk(
    'order/place_order',
    async ({
        price,
        products,
        shipping_fee,
        shippingInfo,
        userId,
        payment_type
    }, { getState, rejectWithValue }) => {

        try {

            const token = getState().auth.token

            const config = {
                headers: {
                    authorization: `Bearer ${token}`
                }
            }

            const { data } = await api.post(
                '/home/order/palce-order',
                {
                    price,
                    products,
                    shipping_fee,
                    shippingInfo,
                    userId,
                    payment_type
                },
                config
            )

            return data

        } catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }
)

export const get_orders = createAsyncThunk(
    'order/get_orders',
    async ({
        customerId,
        status
    }, {
        rejectWithValue,
        fulfillWithValue,
        getState
    }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
        try {
            const {
                data
            } = await api.get(`/home/customer/gat-orders/${customerId}/${status}`, config)
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.response)
        }
    }
)

export const get_order = createAsyncThunk(
    'order/get_order',
    async (orderId, {
        rejectWithValue,
        fulfillWithValue,
        getState
    }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
        try {
            const {
                data
            } = await api.get(`/home/customer/gat-order/${orderId}`, config)
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.response)
        }
    }
)

export const cancel_customer_order = createAsyncThunk(
    'order/cancel_customer_order',
    async ({ orderId, customerId }, { rejectWithValue, fulfillWithValue, getState }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await api.put(
                `/home/order/cancel/${orderId}`,
                { customerId },
                config
            )
            return fulfillWithValue({ ...data, orderId })
        } catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }
)

export const orderReducer = createSlice({
    name: 'order',
    initialState: {
        myOrders: [],
        errorMessage: '',
        successMessage: '',
        myOrder: {},
        serverTime: ''
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ''
            state.successMessage = ''
        }
    },
    extraReducers: {
        [get_orders.fulfilled]: (state, {
            payload
        }) => {
            state.myOrders = payload.orders
            state.serverTime = payload?.serverTime || ''
        },
        [get_order.fulfilled]: (state, {
            payload
        }) => {
            state.myOrder = payload.order
            state.serverTime = payload?.serverTime || ''
        },
        [cancel_customer_order.rejected]: (state, {
            payload
        }) => {
            state.errorMessage = payload?.message || payload?.error || 'Unable to cancel order'
        },
        [cancel_customer_order.fulfilled]: (state, {
            payload
        }) => {
            state.successMessage = payload.message
            state.myOrder = {
                ...state.myOrder,
                order_status: 'REJECT',
                delivery_status: 'cancelled',
                auto_cancel: {
                    ...(state.myOrder?.auto_cancel || {}),
                    enabled: false,
                    expired: false,
                    remainingMs: 0
                }
            }
            state.myOrders = state.myOrders.map((order) =>
                order._id === payload.orderId
                    ? {
                        ...order,
                        order_status: 'REJECT',
                        delivery_status: 'cancelled',
                        auto_cancel: {
                            ...(order?.auto_cancel || {}),
                            enabled: false,
                            expired: false,
                            remainingMs: 0
                        }
                    }
                    : order
            )
        }
    }
})

export const {
    messageClear
} = orderReducer.actions
export default orderReducer.reducer
