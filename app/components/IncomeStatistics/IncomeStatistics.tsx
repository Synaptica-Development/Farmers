'use client';

import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import api from '@/lib/axios';

interface Props {
    filterIndex: number;
    categoryId: number | null;
    subCategoryId: number | null;
}

interface AnalyticsItem {
    title: string;
    income: number;
    salesQuantity: number;
}

const IncomeStatistics = ({ filterIndex, categoryId, subCategoryId }: Props) => {
    const [data, setData] = useState<AnalyticsItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = new URLSearchParams();

                if (categoryId !== null) params.append('categoryID', String(categoryId));
                if (subCategoryId !== null) params.append('subCategoryID', String(subCategoryId));
                if (filterIndex !== null) params.append('filter', String(filterIndex));

                console.log(params.toString());

                const res = await api.get(`/api/Analytics/analytics?${params.toString()}`);
                setData(res.data.items);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            }
        };

        fetchData();
    }, [filterIndex, categoryId, subCategoryId]);

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="6 6" vertical={false} horizontal={true} />
                    <XAxis dataKey="title" />

                    <YAxis
                        yAxisId="left"
                        orientation="left"
                        stroke="#0077B2"
                        tickFormatter={(value) => value.toLocaleString('ka-GE')}
                    />

                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#00B207"
                        domain={[0, 'dataMax + 1']}
                    />

                    <Tooltip
                        formatter={(value, name) => [
                            value.toLocaleString('ka-GE'),
                            name === 'income' ? 'შემოსავალი' : 'რაოდენობა'
                        ]}
                    />
                    <Legend />

                    <Bar
                        yAxisId="left"
                        dataKey="income"
                        name="შემოსავალი"
                        fill="#0077B2"
                        radius={[8, 8, 0, 0]}
                        barSize={30}
                    />
                    <Bar
                        yAxisId="right"
                        dataKey="salesQuantity"
                        name="რაოდენობა"
                        fill="#00B207"
                        radius={[8, 8, 0, 0]}
                        barSize={30}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IncomeStatistics;
