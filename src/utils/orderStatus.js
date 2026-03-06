export const normalizeStatus = (status = '') =>
    String(status).trim().toUpperCase()

const toLabel = (status = '') =>
    normalizeStatus(status)
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())

const deliveryThemeMap = {
    PENDING: { bgColor: '#FFF4E5', color: '#F38E16' },
    PROCESSING: { bgColor: '#EAF4FF', color: '#2F7FD3' },
    PACKED: { bgColor: '#EEF3FF', color: '#3C4FB8' },
    SHIPPED: { bgColor: '#E8F6FB', color: '#0B7EA4' },
    OUT_FOR_DELIVERY: { bgColor: '#E8FBF4', color: '#1E9D63' },
    DELIVERED: { bgColor: '#E6F4EA', color: '#2E8B57' },
    DELIVERY_REJECTED: { bgColor: '#FDE8EA', color: '#CC4255' },
    CANCELLED: { bgColor: '#FDE8EA', color: '#CC4255' }
}

export const getDeliveryStatusMeta = (status) => {
    const normalized = normalizeStatus(status)
    const theme = deliveryThemeMap[normalized] || { bgColor: '#E4F0F5', color: '#122C55' }

    return {
        normalized,
        label: toLabel(normalized),
        ...theme
    }
}

export const getOrderStatusMeta = (status) => {
    const normalized = normalizeStatus(status || 'PENDING')

    if (normalized === 'ACCEPT') {
        return { normalized, label: 'Accepted', bgColor: '#E6F4EA', color: '#2E8B57' }
    }
    if (normalized === 'REJECT') {
        return { normalized, label: 'Rejected', bgColor: '#FDE8EA', color: '#CC4255' }
    }

    return { normalized: 'PENDING', label: 'Pending', bgColor: '#FFF4E5', color: '#F38E16' }
}

export const canCustomerCancelOrder = (order = {}) => {
    const orderStatus = normalizeStatus(order.order_status || 'PENDING')
    const deliveryStatus = normalizeStatus(order.delivery_status || 'PENDING')

    return (
        orderStatus !== 'ACCEPT' &&
        orderStatus !== 'REJECT' &&
        deliveryStatus !== 'CANCELLED' &&
        deliveryStatus !== 'DELIVERY_REJECTED'
    )
}
