export default function formatDate(date: string) {
  let formattedDate = new Date(date);

  let options: any = {
    year: "numeric",
    // month: "long",
  };

  return formattedDate.toLocaleDateString("en-US", options);
}

export function formatDateMonth(date: string, long?: boolean) {
  let formattedDate = new Date(date);

  let options: any = {
    month: long ? "long" : "short",
    year: "numeric",
  };

  return formattedDate.toLocaleDateString("en-US", options);
}
