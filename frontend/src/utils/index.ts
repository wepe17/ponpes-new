export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const formatToIDR = (amount: number) => {
  if (typeof amount !== "number") {
    console.log("Input must be a number", amount);
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr) => {
  const utcDate = new Date(dateStr);

  const day = utcDate.getDate();
  const month = utcDate.toLocaleString("id-ID", { month: "long" });
  const year = utcDate.getFullYear();

  const utcTimestamp = Date.UTC(
    utcDate.getFullYear(),
    utcDate.getMonth(),
    utcDate.getDate(),
    utcDate.getHours(),
    utcDate.getMinutes(),
  );

  const wibDate = new Date(utcTimestamp + 7 * 60 * 60 * 1000);

  const hours = String(wibDate.getUTCHours()).padStart(2, "0");
  const minutes = String(wibDate.getUTCMinutes()).padStart(2, "0");

  return {
    fullDate: `${day} ${month} ${year}`,
    time: `${hours}:${minutes}`,
  };
};
