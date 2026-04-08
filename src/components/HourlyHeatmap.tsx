import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { heatmapData } from '@/lib/mock-data';

export function HourlyHeatmap() {
  const maxTours = Math.max(...heatmapData.map(d => d.tours));

  return (
    <div className="glass-card p-5">
      <h3 className="font-heading font-semibold text-sm mb-4 text-foreground">Hourly Tour Heatmap</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={heatmapData} barCategoryGap="20%">
            <XAxis dataKey="hour" tick={{ fill: 'hsl(215 12% 50%)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(215 12% 50%)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: 'hsl(220 18% 12%)',
                border: '1px solid hsl(220 14% 16%)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'hsl(210 20% 92%)',
              }}
            />
            <Bar dataKey="tours" radius={[4, 4, 0, 0]} name="Tours">
              {heatmapData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={`hsl(217 91% ${40 + (entry.tours / maxTours) * 30}%)`}
                  opacity={0.4 + (entry.tours / maxTours) * 0.6}
                />
              ))}
            </Bar>
            <Bar dataKey="showUps" radius={[4, 4, 0, 0]} fill="hsl(152 69% 45%)" opacity={0.7} name="Show-ups" />
            <Bar dataKey="drafts" radius={[4, 4, 0, 0]} fill="hsl(38 92% 50%)" opacity={0.7} name="Drafts" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
