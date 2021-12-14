const twoDimensionalArray = [
  [1, 3, 1, 2],
  [1, 5, 1, 2],
  [4, 2, 1, 2],
  [4, 2, 1, 2],
]

const min = (i, j) => {
  return i > j ? j : i;
}

const calPath = () => {
  const l = twoDimensionalArray.length;
  const c = twoDimensionalArray[0].length;
  const dp = [new Array(c).fill(0)];
  dp[0][0] = twoDimensionalArray[0][0]; // 左上角最优解是本身
  // 求出第一行的最优解
  for (let i = 1; i < c; i++){
    dp[0][i] = twoDimensionalArray[0][i] + dp[0][i-1];
  }
  // 求出第一列的最优解
  for (let i = 1; i < l; i++){
    if (!dp[i]) {
      dp[i] = [new Array(c).fill(0)];
    }
    dp[i][0] = twoDimensionalArray[i][0] + dp[i-1][0];
  }
  // 比较本格左边、上边最优解中较小的一个，加上自身，成为本格的最优解
  for (let i = 1; i < l; i++){
    for (let j = 1; j < c; j++){
      dp[i][j] = min(dp[i-1][j], dp[i][j - 1]) + twoDimensionalArray[i][j];
    }
  }

  console.log('dp', dp, dp[l-1][c-1]);
  return dp[l-1][c-1];
}

calPath()
