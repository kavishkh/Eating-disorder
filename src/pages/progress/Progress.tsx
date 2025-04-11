
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Minus, CalendarDays, Activity, Brain, HeartPulse, Award, Dumbbell } from 'lucide-react';
import { CardContainer } from '@/components/ui/card-container';
import { ProgressCircle } from '@/components/dashboard/ProgressCircle';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { db } from '@/services/databaseService';
import { CategoryProgress } from '@/types';

const progressCategories = [
  { id: 'mental_health', name: 'Mental Health', icon: Brain, color: '#9b87f5' },
  { id: 'physical', name: 'Physical Activity', icon: Dumbbell, color: '#4ade80' },
  { id: 'learning', name: 'Learning Progress', icon: Award, color: '#f97316' },
  { id: 'overall', name: 'Overall Progress', icon: Activity, color: '#0ea5e9' },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const Progress = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  useEffect(() => {
    const fetchProgressData = async () => {
      setIsLoading(true);
      
      // Get all progress records
      const records = await db.getProgressRecords();
      
      // Get recent progress by category
      const recentProgress = await db.getRecentProgressByCategory();
      
      // Create category data with trends
      const categories: CategoryProgress[] = progressCategories.map(cat => {
        const value = recentProgress[cat.id] || 0;
        // In a real app, we would calculate the trend by comparing with previous values
        // Here we'll just simulate it with random trends
        const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
        const trend = trends[Math.floor(Math.random() * trends.length)];
        const change = trend === 'up' ? Math.floor(Math.random() * 10) : 
                      trend === 'down' ? -Math.floor(Math.random() * 10) : 0;
        
        return {
          category: cat.name,
          value,
          trend,
          change
        };
      });
      
      // Create weekly data for charts
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      const weeklyRecords = records.filter(record => 
        new Date(record.createdAt) >= lastWeek
      );
      
      // Group by date and category
      const groupedData: {[date: string]: {[category: string]: number}} = {};
      
      weeklyRecords.forEach(record => {
        const date = formatDate(record.date);
        if (!groupedData[date]) {
          groupedData[date] = {};
        }
        
        const categoryName = progressCategories.find(cat => cat.id === record.category)?.name || record.category;
        groupedData[date][categoryName] = record.value;
      });
      
      // Convert to array format for charts
      const chartData = Object.keys(groupedData).map(date => ({
        date,
        ...groupedData[date]
      }));
      
      setCategoryData(categories);
      setWeeklyData(chartData);
      setIsLoading(false);
    };
    
    fetchProgressData();
  }, [timeRange]);

  // Calculate trend icon and color
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch(trend) {
      case 'up': 
        return <ArrowUpRight className="text-green-500 h-5 w-5" />;
      case 'down': 
        return <ArrowDownRight className="text-red-500 h-5 w-5" />;
      case 'stable': 
        return <Minus className="text-yellow-500 h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Progress Tracking</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Progress Overview */}
            <CardContainer 
              variant="glass" 
              title="Progress Overview" 
              description="Your current progress across categories"
            >
              <div className="grid grid-cols-2 gap-4">
                {categoryData.map((item) => (
                  <motion.div 
                    key={item.category}
                    className="flex items-center p-3 border border-border rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <h3 className="text-sm font-medium">{item.category}</h3>
                      <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold">{item.value}%</span>
                        {getTrendIcon(item.trend)}
                        <span className={`text-xs ${
                          item.change && item.change > 0 
                            ? 'text-green-500' 
                            : item.change && item.change < 0 
                            ? 'text-red-500' 
                            : 'text-yellow-500'
                        }`}>
                          {item.change ? Math.abs(item.change) : 0}%
                        </span>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <ProgressCircle progress={item.value} size={60} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContainer>
            
            {/* Progress Chart */}
            <CardContainer 
              variant="colorful" 
              title="Progress Trends" 
              description="Your progress over time"
            >
              <div className="flex justify-end mb-2 space-x-2">
                <Button 
                  size="sm" 
                  variant={timeRange === 'week' ? 'default' : 'outline'} 
                  onClick={() => setTimeRange('week')}
                >
                  Week
                </Button>
                <Button 
                  size="sm" 
                  variant={timeRange === 'month' ? 'default' : 'outline'} 
                  onClick={() => setTimeRange('month')}
                >
                  Month
                </Button>
                <Button 
                  size="sm" 
                  variant={timeRange === 'year' ? 'default' : 'outline'} 
                  onClick={() => setTimeRange('year')}
                >
                  Year
                </Button>
              </div>
              
              <div className="h-[250px]">
                <ChartContainer 
                  config={{
                    'Mental Health': { color: '#9b87f5' },
                    'Physical Activity': { color: '#4ade80' },
                    'Learning Progress': { color: '#f97316' },
                    'Overall Progress': { color: '#0ea5e9' }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <ChartTooltip />
                      <Legend />
                      {progressCategories.map((category) => (
                        <Line
                          key={category.id}
                          type="monotone"
                          dataKey={category.name}
                          name={category.name}
                          stroke={category.color}
                          strokeWidth={2}
                          dot={{ fill: category.color, strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: category.color }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContainer>
          </div>
          
          {/* Calendar Widget */}
          <CardContainer
            variant="frosted"
            title="Progress Calendar"
            description="Daily tracking overview"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                <span className="font-medium">April 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  <span className="text-xs">High</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <span className="text-xs">Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                  <span className="text-xs">None</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {/* This is just a placeholder calendar - in a real app we'd use a proper date picker */}
              {[...Array(30)].map((_, index) => {
                const day = index + 1;
                // Randomly assign color for demo purposes
                const colors = ['bg-green-400', 'bg-yellow-400', 'bg-gray-400'];
                const randomColor = colors[Math.floor(Math.random() * 3)];
                
                return (
                  <motion.div
                    key={day}
                    className="aspect-square rounded-md border flex flex-col items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-sm">{day}</span>
                    <div className={`h-2 w-2 rounded-full ${randomColor} mt-1`}></div>
                  </motion.div>
                );
              })}
            </div>
          </CardContainer>
        </TabsContent>
        
        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <CardContainer variant="glass" title="Category Breakdown" description="Progress by category">
              <div className="h-[300px]">
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="category" />
                      <YAxis domain={[0, 100]} />
                      <ChartTooltip />
                      <Bar dataKey="value" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContainer>
            
            {/* Progress Insights */}
            <CardContainer variant="colorful" title="Progress Insights" description="AI-generated observations">
              <div className="space-y-4">
                {progressCategories.map((category) => {
                  const progress = categoryData.find(c => c.category === category.name)?.value || 0;
                  let insight = "";
                  
                  if (progress < 30) {
                    insight = `Your ${category.name.toLowerCase()} progress is just getting started. Keep going!`;
                  } else if (progress < 70) {
                    insight = `You're making steady progress in ${category.name.toLowerCase()}. Consistency is key!`;
                  } else {
                    insight = `Excellent work on your ${category.name.toLowerCase()} progress! You're doing great.`;
                  }
                  
                  const Icon = category.icon;
                  
                  return (
                    <motion.div 
                      key={category.id}
                      className="p-3 border border-border rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4" style={{ color: category.color }} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight}</p>
                    </motion.div>
                  );
                })}
              </div>
            </CardContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <CardContainer variant="frosted" title="Progress Timeline" description="Your journey so far">
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => {
                const randomCategory = progressCategories[Math.floor(Math.random() * progressCategories.length)];
                const randomProgress = Math.floor(Math.random() * 100);
                const daysAgo = index * 2;
                const date = new Date();
                date.setDate(date.getDate() - daysAgo);
                
                return (
                  <motion.div 
                    key={index}
                    className="p-4 border border-border rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${randomCategory.color}20` }}>
                          <randomCategory.icon className="h-4 w-4" style={{ color: randomCategory.color }} />
                        </div>
                        <div>
                          <h3 className="font-medium">{randomCategory.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(date.toISOString())} • {daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}
                          </p>
                        </div>
                      </div>
                      <ProgressCircle progress={randomProgress} size={40} strokeWidth={4} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Progress;
