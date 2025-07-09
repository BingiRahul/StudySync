import { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";
import {
  FaBolt,
  FaArrowUp,
  FaArrowDown,
  FaGraduationCap,
  FaStickyNote,
  FaBookOpen,
  FaQuestionCircle,
  FaRegLightbulb,
  FaArrowUp as FaViewAll,
} from "react-icons/fa";

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // OPTIONAL: Replace token logic with your auth flow
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDashboardData(res.data);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p>Loading Dashboard...</p>;

  if (!dashboardData) return <p>Unable to load dashboard.</p>;

  const { user, stats, quote, activities } = dashboardData;

  const statData = [
    {
      icon: <FaStickyNote />,
      title: "Notes",
      value: stats.notes,
      unit: "",
      trend: "+10%", // Static for now — adjust if you have real trends
      trendUp: true,
    },
    {
      icon: <FaRegLightbulb />,
      title: "Summaries",
      value: stats.summaries,
      unit: "",
      trend: "+3",
      trendUp: true,
    },
    {
      icon: <FaQuestionCircle />,
      title: "Quizzes",
      value: stats.quizzes,
      unit: "",
      trend: "-2",
      trendUp: false,
    },
    {
      icon: <FaBookOpen />,
      title: "Flashcards",
      value: stats.flashcards,
      unit: "",
      trend: "+25",
      trendUp: true,
    },
  ];

  return (
    <div className="dashboard">
      <section className="welcome-section">
        <div className="welcome-text">
          <h1>Welcome back, {user.name}!</h1>
          <p>Keep up the great progress — you're on a roll!</p>
        </div>
        <div className="streak-box">
          <div className="streak-icon-bg">
            <FaBolt className="streak-icon" />
          </div>
          <div className="streak-info">
            <div className="streak-row">
              <span className="streak-number">{user.streak}</span>
              <span className="streak-label">Day Streak</span>
              <span className="streak-consistency">🔥 You're consistent!</span>
            </div>
          </div>
          <div className="streak-avatar">
            <FaGraduationCap />
          </div>
        </div>
      </section>

      <div className="overview-grid">
        {statData.map((stat, i) => (
          <div className="stat-box" key={i}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <div className="stat-value-row">
                <span className="stat-value">{stat.value}</span>
                {stat.unit && <span className="stat-unit">{stat.unit}</span>}
              </div>
              <div className="stat-label-row">
                <span className="stat-title">{stat.title}</span>
                <span
                  className={`stat-trend ${stat.trendUp ? "up" : "down"}`}
                >
                  {stat.trendUp ? <FaArrowUp /> : <FaArrowDown />} {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="panel-grid">
        {/* Quote of the Day */}
        <div className="panel quote-panel">
          <div className="panel-header">
            <span>Quote of the Day</span>
            <FaRegLightbulb />
          </div>
          <div className="quote-content">
            <p className="quote-text">“{quote.text}”</p>
            <p className="quote-author">– {quote.author}</p>
          </div>
        </div>

        {/* Activity */}
        <div className="panel activity">
          <div className="panel-header">
            <span>Recent Activity</span>
          </div>
          {activities.slice(0, 4).map((act, i) => (
            <div className="activity-item" key={i}>
              <div className="activity-icon" />
              <div className="activity-text">
                <p>
                  <strong>{act.name}</strong> {act.action}
                </p>
                <span>{act.time}</span>
              </div>
            </div>
          ))}
          <div className="panel-footer">
            <FaViewAll /> View All Activity
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
