export default function GroupByYear(items: any[]) {
  // this gives an object with years as keys
  const years = items.reduce((years, item) => {
    const year = item.date.split("T")[0];
    if (!years[year]) {
      years[year] = [];
    }
    years[year].push(item);
    return years;
  }, {});

  //   Edit: to add it in the array format instead
  const yearArrays = Object.keys(years).map((year) => {
    return {
      year,
      items: years[year],
    };
  });

  return yearArrays;
  //   console.log(groupArrays);
}
