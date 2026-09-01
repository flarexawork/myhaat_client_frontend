import {
    createSlice,
    createAsyncThunk
} from '@reduxjs/toolkit'
import api from '../../api/api'
export const get_category = createAsyncThunk(
    'product/get_category',
    async (_, {
        fulfillWithValue,
        rejectWithValue
    }) => {
        try {
            const {
                data
            } = await api.get('/home/get-categorys')
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.response)
            return rejectWithValue(error.response.data || error.response)

        }
    }
)

export const get_products = createAsyncThunk(
    'product/get_products',
    async (_, {
        fulfillWithValue,
        rejectWithValue
    }) => {
        try {
            const {
                data
            } = await api.get('/home/get-products')
            return fulfillWithValue(data)
        } catch (error) {
           
            console.log(error.response)
            return rejectWithValue(error.response.data || error.response)
        }
    }
)

export const get_featured_products = createAsyncThunk(
    'product/get_featured_products',
    async ({ page = 1, limit = 16 }, {
        fulfillWithValue,
        rejectWithValue
    }) => {
        try {
            const {
                data
            } = await api.get(`/home/get-featured-products?page=${page}&&limit=${limit}`)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || error.response)
        }
    }
)

export const get_product = createAsyncThunk(
    'product/get_product',
    async (slug, {
        fulfillWithValue,
        rejectWithValue
    }) => {
        try {
            const {
                data
            } = await api.get(`/home/get-product/${slug}`)
          
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data || error.response)
            console.log(error.response)
        }
    }
)

export const price_range_product = createAsyncThunk(
    'product/price_range_product',
    async (_, {
        fulfillWithValue,
        rejectWithValue
    }) => {
        try {
            const {
                data
            } = await api.get('/home/price-range-latest-product')
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.response)
            return rejectWithValue(error.response.data || error.response)
        }
    }
)

export const get_banners = createAsyncThunk(
    'product/get_banners',
    async (_, {
        fulfillWithValue,
        rejectWithValue
    }) => {
        try {
            const {
                data
            } = await api.get('/banners')
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.response)
            return rejectWithValue(error.response.data || error.response)
        }
    }
)

export const query_products = createAsyncThunk(
    'product/query_products',
    async (query, {
        fulfillWithValue,
        rejectWithValue
    }) => {
        try {
            const {
                data
            } = await api.get(`/home/query-products?category=${query.category}&&rating=${query.rating}&&lowPrice=${query.low}&&highPrice=${query.high}&&sortPrice=${query.sortPrice}&&pageNumber=${query.pageNumber}&&searchValue=${query.searchValue ? query.searchValue : ''}`)
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.response)
            return rejectWithValue(error.response.data || error.response)
        }
    }
)

export const customer_review = createAsyncThunk(
    'review/customer_review',
    async (info, {
        fulfillWithValue,
        rejectWithValue
    }) => {
        try {
            const {
                data
            } = await api.post('/home/customer/submit-review', info)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data || error.response)
        }
    }
)

export const get_reviews = createAsyncThunk(
    'review/get_reviews',
    async ({
        productId,
        pageNumber
    }, {
        fulfillWithValue,
        rejectWithValue
    }) => {
        try {
            const {
                data
            } = await api.get(`/home/customer/get-reviews/${productId}?pageNo=${pageNumber}`)
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data || error.response)
        }
    }
)

export const homeReducer = createSlice({
    name: 'home',
    initialState: {
        categorys: [],
        products: [],
        totalProduct: 0,
        parPage: 4,
        latest_product: [],
        topRated_product: [],
        discount_product: [],
        priceRange: {
            low: 0,
            high: 100
        },
        product: {},
        relatedProducts: [],
        moreProducts: [],
        featuredProducts: [],
        featuredPage: 0,
        featuredTotalProduct: 0,
        featuredHasMore: true,
        featuredLoading: false,
        successMessage: '',
        errorMessage: '',
        totalReview: 0,
        rating_review: [],
        reviews: [],
        banners: [],
        productsLoading: false,
        productLoading: false,
        reviewsLoading: false
    },
    reducers: {
        messageClear: (state, _) => {
            state.successMessage = ""
            state.errorMessage = ""
        }
    },
    extraReducers: {
        [get_products.pending]: (state, _) => {
            state.productsLoading = true
        },
        [get_category.fulfilled]: (state, {
            payload
        }) => {
            state.categorys = payload.categorys
        },
        [get_products.fulfilled]: (state, {
            payload
        }) => {
            state.productsLoading = false
            state.products = payload.products
            state.latest_product = payload.latest_product
            state.topRated_product = payload.topRated_product
            state.discount_product = payload.discount_product
        },
        [get_products.rejected]: (state, _) => {
            state.productsLoading = false
        },
        [get_product.pending]: (state, _) => {
            state.productLoading = true
        },
        [get_product.fulfilled]: (state, {
            payload
        }) => {
            state.productLoading = false
            state.product = payload.product
            state.relatedProducts = payload.relatedProducts
            state.moreProducts = payload.moreProducts
        },
        [get_product.rejected]: (state, _) => {
            state.productLoading = false
        },
        [price_range_product.fulfilled]: (state, {
            payload
        }) => {
            state.latest_product = payload.latest_product
            state.priceRange = payload.priceRange
        },
        [query_products.fulfilled]: (state, {
            payload
        }) => {
            state.products = payload.products
            state.totalProduct = payload.totalProduct
            state.parPage = payload.parPage
        },
        [customer_review.fulfilled]: (state, {
            payload
        }) => {
            state.successMessage = payload.message
        },
        [get_reviews.pending]: (state, _) => {
            state.reviewsLoading = true
        },
        [get_reviews.fulfilled]: (state, {
            payload
        }) => {
            state.reviewsLoading = false
            state.reviews = payload.reviews
            state.totalReview = payload.totalReview
            state.rating_review = payload.rating_review
        },
        [get_reviews.rejected]: (state, _) => {
            state.reviewsLoading = false
        },
        [get_banners.fulfilled]: (state, {
            payload
        }) => {
            state.banners = payload.banners
        },
        [get_featured_products.pending]: (state, _) => {
            state.featuredLoading = true
        },
        [get_featured_products.fulfilled]: (state, {
            payload
        }) => {
            state.featuredLoading = false
            state.featuredPage = payload.page
            state.featuredHasMore = payload.hasMore
            state.featuredTotalProduct = payload.totalProduct
            state.featuredProducts = payload.page === 1
                ? payload.products
                : [
                    ...state.featuredProducts,
                    ...payload.products.filter((product) => !state.featuredProducts.some((item) => item._id === product._id))
                ]
        },
        [get_featured_products.rejected]: (state, _) => {
            state.featuredLoading = false
            state.featuredHasMore = false
        },

    }
})
export const {
    messageClear
} = homeReducer.actions
export default homeReducer.reducer
