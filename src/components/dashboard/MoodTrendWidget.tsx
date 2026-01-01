import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MoodEntry } from '@/types/types';
import { format, startOfWeek, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Mood definitions (matching the ones from MoodTrackerPage)
const moodDefinitions = [
  { value: 1, label: "Very Low", color: "text-red-500", bg: "bg-red-100" },
  { value: 2, label: "Low", color: "text-orange-500", bg: "bg-orange-100" },
  { value: 3, label: "Neutral", color: "text-yellow-500", bg: "bg-yellow-100" },
  { value: 4, label: "Good", color: "text-green-500", bg: "bg-green-100" },
  { value: 5, label: "Great", color: "text-emerald-500", bg: "bg-emerald-100" },
];

interface MoodTrendWidgetProps {
  limit?: number;
  height?: number;
  showTitle?: boolean;
}

const MoodTrendWidget = ({
  limit = 7,
  height = 160,
  showTitle = true
}: MoodTrendWidgetProps) => {
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Get mood details based on value
  const getMoodDetails = (value: number) => {
    return moodDefinitions.find(mood => mood.value === value) || moodDefinitions[2]; // Default to neutral
  };

  useEffect(() => {
    const fetchMoodData = async () => {
      setLoading(true);

      try {
        if (!currentUser?.id) {
          setMoodData([]);
          setLoading(false);
          return;
        }

        // Import the mood service
        const { getUserRecentMoodEntries } = await import('../../services/moodService');

        // Fetch mood data from MongoDB
        const moods = await getUserRecentMoodEntries(currentUser.id, limit);

        // Get the current week starting from Monday
        const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
        const lastDays = [...Array(limit)].map((_, i) => {
          const date = addDays(monday, i);
          return format(date, 'yyyy-MM-dd');
        });

        // Map the dates to mood entries or use a default value
        const chartData = lastDays.map(date => {
          const entry = moods.find((entry: MoodEntry) => entry.date === date);
          return entry || { date, mood: 0, note: "", userId: currentUser.id };
        });

        setMoodData(chartData);
      } catch (error) {
        console.error("Failed to fetch mood data:", error);
        setMoodData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [currentUser, limit]);

  // Calculate height percentage for mood bars with improved scaling
  const getMoodHeight = (moodValue: number) => {
    if (moodValue === 0) return '0%'; // No height for no entry

    // Scale moods from 1-5 to appropriate percentages that won't overlap with headers
    const maxBarHeight = 65; // Maximum percentage height for a bar
    const scale = maxBarHeight / 5; // Scale factor

    return `${moodValue * scale}%`;
  };

  // Get baseline position for the chart (middle)
  const getBaselinePosition = () => {
    return '50%'; // Middle of the chart area
  };

  if (loading) {
    return (
      <Card className="border-healing-200">
        {showTitle && (
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-healing-800">
              Mood Trends
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <Skeleton className="w-full h-[160px] rounded-md" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-healing-200">
      {showTitle && (
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-healing-800">
            Mood Trends
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="pt-4">
        <div
          className="relative"
          style={{
            height: `${height}px`,
            marginTop: '10px' // Add margin to ensure separation from header
          }}
        >
          {/* Baseline (neutral line) */}
          <div
            className="absolute w-full h-px bg-gray-300"
            style={{ top: getBaselinePosition() }}
          ></div>

          <div className="flex h-full w-full items-end justify-between">
            {moodData.map((entry, i) => {
              const moodDetail = entry.mood ? getMoodDetails(entry.mood) : null;
              const dayName = format(new Date(entry.date), 'EEE');

              return (
                <div key={i} className="flex flex-col items-center relative h-full">
                  {entry.mood > 0 && (
                    <div
                      className={`w-8 rounded-sm transition-all hover:opacity-80 ${moodDetail?.bg || 'bg-gray-100 bg-opacity-30'
                        }`}
                      style={{
                        height: getMoodHeight(entry.mood),
                        position: 'absolute',
                        bottom: entry.mood <= 3 ? 'auto' : getBaselinePosition(),
                        top: entry.mood <= 3 ? getBaselinePosition() : 'auto',
                        backgroundColor: i === moodData.length - 1 ? 'rgb(155, 135, 245)' : undefined,
                        maxHeight: `calc(${getBaselinePosition()} - 10px)`, // Prevent overlap with header
                      }}
                      title={entry.note || `Mood: ${moodDetail?.label || 'None'} (${entry.date})`}
                    ></div>
                  )}
                  <span className="absolute bottom-0 text-xs font-medium">{dayName}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-4 text-center">
          <Link
            to="/mood"
            className="text-sm text-healing-600 hover:text-healing-800 flex items-center justify-center"
          >
            View detailed mood history <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTrendWidget;