"use client"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface AreaChartData{
  name:string,
  value:number,
}

export interface Props{
  data:AreaChartData[]
}

export default function Chart({data}:Props) {
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
        <AreaChart
          data={data}
          margin={{
            top: 30,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis dataKey="name" className='text-xs sm:text-sm'/>
          <YAxis className="text-xs sm:text-sm" domain={['dataMin - 0.1', 'auto']} /> 
          <Tooltip />
          <Area
          type="monotone"
          dataKey="value"
          fill="#ED9E88"
          stroke="#E8792A"
          fillOpacity={0.3} // Adjust fill opacity for a lighter look
        />
        </AreaChart>
      </ResponsiveContainer>
  )
}
