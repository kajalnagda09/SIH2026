import ReactECharts from 'echarts-for-react';

export function RadarChart({ data }: { data: { name: string; value: number }[] }) {
  if (!data.length) return null;
  return (
    <ReactECharts
      style={{ height: 320 }}
      option={{
        animationDuration: 800,
        animationEasing: 'quarticOut',
        radar: {
          indicator: data.map((d) => ({ name: d.name, max: 100 })),
          shape: 'polygon',
          splitArea: { areaStyle: { color: ['rgba(13,92,75,0.02)', 'rgba(13,92,75,0.05)'] } },
        },
        series: [{
          type: 'radar',
          data: [{ value: data.map((d) => d.value), name: 'Skills', areaStyle: { color: 'rgba(13,92,75,0.2)' }, lineStyle: { color: '#0D5C4B' } }],
        }],
      }}
    />
  );
}
