const interval = 1000; // 设定倒计时规则为每秒倒计时
let totalCount = 30000; // 设定总倒计时长为30s
let count = 0; // 记录递归已执行次数，以倒计时时间间隔 interval=1s 为例，那么count就相当于如果没有时间偏差情况下的理想执行时间

const startTime = new Date().getTime(); // 记录程序开始运行的时间
let timeoutID = setTimeout(countDownFn, interval);

// 倒计时回调函数
export function countDownFn() {
  count++; // count自增，记录理想执行时间
  // 获取当前时间减去刚开始记录的startTime再减去理想执行时间得到时间偏差：等待执行栈为空的时间
  const offset = new Date().getTime() - startTime - count * interval;
  let nextTime = interval - offset; // 根据时间偏差，计算下次倒计时设定的回调时间，从而达到纠正的目的
  if (nextTime < 0) {
    nextTime = 0;
  }
  totalCount -= interval;
  if (totalCount < 0) {
    clearTimeout(timeoutID);
  } else {
    timeoutID = setTimeout(countDownFn, nextTime);
  }
}
