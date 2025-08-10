export const getImages = (count) =>
  Array(count)
    .fill(null)
    .map((_, index) => ({
      uri: `https://source.unsplash.com/random/100x100?sig=${index + 1}`,
    }));
