import ReactECharts from 'echarts-for-react';

export function FunnelChart({ data }: { data: { status: string; count: number }[] }) {
  return (
    <ReactECharts
      style={{ height: 320 }}
      option={{
        animationDuration: 800,
        tooltip: { trigger: 'item' },
        series: [{
          type: 'funnel',
          left: '10%',
          width: '80%',
          data: data.map((d) => ({ name: d.status, value: d.count })),
          itemStyle: { borderColor: '#fff', borderWidth: 1 },
          label: { show: true, position: 'inside' },
        }],
      }}
    />
  );
}
