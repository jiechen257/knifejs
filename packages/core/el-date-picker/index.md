## source code
```js
<template>
  <el-date-picker
    v-model="requestTimeRange"
    type="datetimerange"
    range-separator=" - "
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :style="{ width: '380px', marginTop: '5px' }"
    :picker-options="pickerOptions"
  >
  </el-date-picker>
</template>

<script lang="ts">
// @ts-ignore
export default {
  data() {
    return {
      requestTimeRange: [],
      // 时间选择参数
      daterange: {
        maxTime: "",
        minTime: "",
        max: 7, // 设置时间最大间隔区间
      },
      // 时间过滤
      pickerOptions: {
        onPick: (time: any) => {
          if (!time.maxDate) {
            let timeRange = this.daterange.max * 24 * 60 * 60 * 1000;
            this.daterange.minTime = time.minDate.getTime() - timeRange;
            this.daterange.maxTime = time.minDate.getTime() + timeRange;
          } else {
            this.daterange.maxTime = "";
            this.daterange.minTime = "";
          }
        },
        disabledDate: (time: any) => {
          if (this.daterange.minTime && this.daterange.maxTime) {
            return (
              time.getTime() < this.daterange.minTime ||
              time.getTime() > this.daterange.maxTime
            );
          }
        }
      }
    }
  },
}
</script>

```