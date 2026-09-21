import ReactECharts from 'echarts-for-react';

export function BarChart({ data, title }: { data: { name: string; value: number }[]; title?: string }) {
  return (
    <ReactECharts
      style={{ height: 300 }}
      option={{
        title: title ? { text: title, textStyle: { fontSize: 14, fontWeight: 500 } } : undefined,
        animationDuration: 800,
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: data.map((d) => d.name), axisLabel: { rotate: 30, fontSize: 10 } },
        yAxis: { type: 'value' },
        series: [{ type: 'bar', data: data.map((d) => d.value), itemStyle: { color: '#0D5C4B', borderRadius: [4, 4, 0, 0] } }],
        grid: { left: 40, right: 20, bottom: 60, top: title ? 40 : 20 },
      }}
    />
  );
}
