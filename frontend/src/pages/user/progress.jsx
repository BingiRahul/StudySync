import React, { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import "./progress.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ProgressPage = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/progress", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProgressData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) return <div className="progress-page">Loading...</div>;
  if (!progressData) return <div className="progress-page">No Data Found</div>;

  // Chart Data Transformations
  const quizPerformanceChartData = {
    labels: progressData.quizPerformance.labels,
    datasets: [
      {
        label: "Quiz Scores",
        data: progressData.quizPerformance.scores,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const studyStreakChartData = {
    labels: progressData.studyStreak.labels,
    datasets: [
      {
        label: "Study Days",
        data: progressData.studyStreak.studied,
        backgroundColor: progressData.studyStreak.studied.map((val) =>
          val ? "#34d399" : "#ef4444"
        ),
      },
    ],
  };

  const timeSpentChartData = {
    labels: progressData.timeSpent.labels,
    datasets: [
      {
        data: progressData.timeSpent.hours,
        backgroundColor: ["#34d399", "#3b82f6", "#f59e0b"],
        hoverOffset: 20,
      },
    ],
  };

  return (
    <div className="progress-page">
      <div className="progress-page-container">
        <div className="progress-page-header">
          <h2>Your Progress</h2>
          <p>Track your learning trends and see how far you’ve come!</p>
        </div>

        <div className="progress-page-content">
          <div className="progress-page-charts">
            <div className="progress-chart-section">
              <h3>Quiz Performance Over Time</h3>
              <div className="progress-chart-container">
                <Line
                  data={quizPerformanceChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                      title: {
                        display: true,
                        text: `Average Score: ${progressData.quizPerformance.average}%`,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                          display: true,
                          text: "Score (%)",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="progress-chart-section">
              <h3>Study Streak History</h3>
              <div className="progress-chart-container">
                <Bar
                  data={studyStreakChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                      title: {
                        display: true,
                        text: `Best Streak: ${progressData.studyStreak.bestStreak} days`,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 1,
                        ticks: {
                          stepSize: 1,
                          callback: (value) =>
                            value === 1 ? "Studied" : "Skipped",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="progress-chart-section">
              <h3>Time Spent on Learning</h3>
              <div className="progress-chart-container progress-pie-chart">
                <Pie
                  data={timeSpentChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "right" },
                      title: {
                        display: true,
                        text: `Total: ${progressData.timeSpent.totalHours.toFixed(
                          1
                        )} hours`,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          <div className="progress-page-sidebar">
            <div className="progress-subject-performance">
              <h3>Subject Performance</h3>
              <div className="progress-subject-grid">
                {progressData.subjects.map((subject) => (
                  <div
                    className={`progress-subject-card progress-${subject.trend}`}
                    key={subject.name}
                  >
                    <h4>{subject.name}</h4>
                    <p>Average Score: {subject.avgScore}%</p>
                    <p>Notes Created: {subject.notes}</p>
                    <p>
                      Time Spent: {subject.timeSpent?.toFixed(1)} hours
                    </p>
                    <div className="progress-trend-indicator">
                      {subject.trend === "improving"
                        ? "↑ Improving"
                        : "↓ Declining"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="progress-areas-for-improvement">
              <h3>Areas for Improvement</h3>
              <div className="progress-insights-list">
                {progressData.insights.map((insight, index) => (
                  <div
                    className={`progress-insight-item progress-${insight.priority}`}
                    key={index}
                  >
                    <p>{insight.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
