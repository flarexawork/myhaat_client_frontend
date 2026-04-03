export const getServerTimeOffsetMs = (serverTime) => {
  const serverTimeMs = Date.parse(serverTime || "");

  if (!Number.isFinite(serverTimeMs)) {
    return 0;
  }

  return serverTimeMs - Date.now();
};

export const getOrderAutoCancelTimer = (order, currentServerTimeMs = Date.now()) => {
  const autoCancel = order?.auto_cancel || {};
  const deadlineMs = Date.parse(autoCancel.deadlineAt || "");
  const enabled = Boolean(autoCancel.enabled && Number.isFinite(deadlineMs));
  const remainingMs = enabled ? Math.max(deadlineMs - currentServerTimeMs, 0) : 0;
  const remainingSeconds = enabled ? Math.ceil(remainingMs / 1000) : 0;
  const isExpired = enabled && remainingMs === 0;

  if (!enabled) {
    return {
      enabled: false,
      remainingMs: 0,
      remainingSeconds: 0,
      isExpired: false,
      bgColor: "",
      color: "",
      text: "",
    };
  }

  if (remainingSeconds >= 40) {
    return {
      enabled: true,
      remainingMs,
      remainingSeconds,
      isExpired,
      bgColor: "#E6F4EA",
      color: "#2E8B57",
      text: `Auto cancelling in ${remainingSeconds} seconds`,
    };
  }

  if (remainingSeconds >= 15) {
    return {
      enabled: true,
      remainingMs,
      remainingSeconds,
      isExpired,
      bgColor: "#FFF4E5",
      color: "#F38E16",
      text: `Auto cancelling in ${remainingSeconds} seconds`,
    };
  }

  return {
    enabled: true,
    remainingMs,
    remainingSeconds,
    isExpired,
    bgColor: "#FDE8EA",
    color: "#CC4255",
    text: `Auto cancelling in ${remainingSeconds} seconds`,
  };
};
