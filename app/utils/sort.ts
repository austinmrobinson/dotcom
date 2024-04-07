import { Project } from "../types";
import formatDate from "./formatDate";

// Oldest to Newest
export function sortAsc(items: Project[] | undefined) {
  const sorted =
    items
      ?.slice()
      .sort(
        (a, b) => parseInt(formatDate(a.date)) - parseInt(formatDate(b.date))
      ) || [];
  return sorted;
}

// Oldest to Newest
// export function sortAscStart(items: Role[] | Company[] | undefined) {
//   const sorted =
//     items?.slice().sort(
//       (a, b) =>
//         parseInt(formatDate(a.startDate)) -
//         parseInt(formatDate(b.startDate))
//     ) || [];
//   return sorted;
// }

// Newest to Oldest
export function sortDesc(items: Project[] | undefined) {
  const sorted =
    items
      ?.slice()
      .sort(
        (a, b) => parseInt(formatDate(b.date)) - parseInt(formatDate(a.date))
      ) || [];
  return sorted;
}
// Newest to Oldest
// export function sortDescStart(items: Company[] | undefined) {
//   const sorted =
//     items?.slice().sort(
//       (a, b) =>
//         parseInt(formatDate(b.startDate)) -
//         parseInt(formatDate(a.startDate))
//     ) || [];
//   return sorted;
// }
