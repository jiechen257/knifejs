## setInterval

```js
function countDown(seconds) {   // seconds就是传入的倒计时，一般是毫秒expired_time / 1000得到的值
	setInterval({
		seconds -= 1;
		fn()
		if (seconds <= 0) {
			cleatInterval();  // 倒计时为0，清除倒计时
		}
	}, 1000)
}
```

问题：定时器指定的时间间隔，表示的是何时将定时器的代码添加到消息队列，而不是何时执行代码。所以真正何时执行代码的时间是不能保证的，取决于何时被主线程的事件循环取到，并执行

也就是说，使用 setInterval 在时间基数大的情况下，调用次数一多，偏差也会增大，没办法做到准确倒计时

## 改进一：setTimeout

```js
const interval = 1000; // 设定倒计时规则为每秒倒计时
let totalCount = 30000; // 设定总倒计时长为30s
let count = 0; // 记录递归已执行次数，以倒计时时间间隔 interval=1s 为例，那么count就相当于如果没有时间偏差情况下的理想执行时间

const startTime = new Date().getTime(); // 记录程序开始运行的时间
let timeoutID = setTimeout(countDownFn, interval);

// 倒计时回调函数
function countDownFn() {
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
```

核心思想就是 `diffTime` ： 利用进入函数时获取的 startTime 和 offeset，计算得到下一次时间的执行准确时间，如果超时，进行重置操作，以此来不断调整倒计时时间达到精确计时

## 改进二：使用 requestAnimationFrame

本质上还是 diffTime 的思想，只不过计时的精度又提升了，从 setTimeout 到 requestAnimationFrame

API 参考：[window.requestAnimationFrame - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)

```js
durationFormat(time) {
  if (!time) return { ss: 0 }
  let t = time
  const ss = t % 60
  t = (t - ss) / 60
  if (t < 1) return { ss }
  const mm = t % 60
  t = (t - mm) / 60
  if (t < 1) return { mm, ss }
  const hh = t % 24
  t = (t - hh) / 24
  if (t < 1) return { hh, mm, ss }
  const dd = t
  return { dd, hh, mm, ss }
},
startCountDown() {
  this.curTime = Date.now()
  requestAnimationFrame(this.getCountDownTime.bind(this, this.getTime))
},
getCountDownTime(time) {
  if (time < 0) {
	return
  }
  const { dd, hh, mm, ss } = this.durationFormat(time)
  this.days = dd || 0
  this.hours = hh || 0
  this.mins = mm || 0
  this.seconds = ss || 0
  const now = Date.now()
  const diffTime = (now - this.curTime) / 1000
  if (diffTime < 1) {
	requestAnimationFrame(this.getCountDownTime.bind(this, time))
  } else {
	const step = Math.floor(diffTime)
	this.curTime = now
	requestAnimationFrame(this.getCountDownTime.bind(this, (time - step)))
  }
  // console.log(diffTime)
}


function countDown(seconds) {
    const interval = 1000 // 设定倒计时规则为每秒倒计时
    let totalCount = seconds // 总倒计时长

    let startTime = Date.now() // 记录程序开始运行的时间
    requestAnimation(countDownFn(totalCount))

    // 倒计时回调函数
    function countDownFn() {
        if (totalCount < 0) {
            return
        }
        const offset = Date.now() - startTime // 时间偏差
        if (offset < 0 ) {
            requestAnimation(countDownFn(totalCount))
        } else {
            startTime = new Date().getTime()
            requestAnimation(countDownFn(totalCount - offset))
        }
    }
}

```

从两个 API 的设计来看，requestAnimationFrame 实现的倒计时更为精准，但 setTimeout 应该也够用了，看自己具体使用场景的取舍
