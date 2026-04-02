import api from "../api/api";

export const normalizeShippingFee = (value) => {
  const shippingFee = Number(value);
  return Number.isFinite(shippingFee) && shippingFee > 0 ? shippingFee : 0;
};

export const calculateShippingFee = (shippingFee, groupCount = 1) => {
  const normalizedGroupCount = Number(groupCount);
  const safeGroupCount =
    Number.isFinite(normalizedGroupCount) && normalizedGroupCount > 0
      ? normalizedGroupCount
      : 0;

  return normalizeShippingFee(shippingFee) * safeGroupCount;
};

export const getShippingFeeFromSettings = async () => {
  const { data } = await api.get("/settings");
  return normalizeShippingFee(data?.settings?.shipping_fee ?? data?.shipping_fee);
};

export const fetchShippingFee = async (groupCount = 1, fallbackFee = 0) => {
  try {
    const shippingFee = await getShippingFeeFromSettings();
    return calculateShippingFee(shippingFee, groupCount);
  } catch (error) {
    return normalizeShippingFee(fallbackFee);
  }
};
