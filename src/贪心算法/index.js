let greedy = (heights) => {
  let mid;
  Math.round(sum(heights) / 2);
  let total = 0;
  let leftHeights = [];
  let rightHeights = [];
  let left = [];
  let right = [];

  heights.forEach((height, index) => {
    if (sum(leftHeights) &gt; sum(rightHeights)) {
      right.push(index);
      rightHeights.push(height);
    } else {
      left.push(index);
      leftHeights.push(height);
    }
    total += height;
  });

  return { left, right };
};
