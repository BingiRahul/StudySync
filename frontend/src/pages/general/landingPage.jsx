import './landingPage.css';

const features = [
  {
    title: '📝 Smart Summaries',
    description: 'Transform your notes into concise, AI-powered summaries in seconds.',
  },
  {
    title: '📚 Quiz Creator',
    description: 'Effortlessly generate quizzes tailored to your study material.',
  },
  {
    title: '📈 Progress Tracker',
    description: 'Visualize your learning journey with an intuitive dashboard.',
  },
  {
    title: '🔒 Private & Secure',
    description: 'Rest assured with end-to-end encryption for your data.',
  },
];

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <header className="landing-navbar" role="banner">
        <div className="landing-container">
          <h1 className="landing-logo">
            <a href="/" aria-label="StudySync Home">StudySync</a>
          </h1>
          <nav aria-label="Main navigation">
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#contact" className="landing-nav-link">Contact</a>
            <a href="/login" className="landing-btn-primary" aria-label="Get Started with StudySync">Get Started</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-container landing-hero-content">
          <h2>Empower Your Learning with StudySync</h2>
          <p>Streamline your studies with AI-driven tools built for efficiency and clarity.</p>
          <a href="/register" className="landing-btn-primary landing-btn-hero" aria-label="Try StudySync for Free">Try It Free</a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-features-section">
        <div className="landing-container landing-wide-features">
          <h3 className="landing-features-title">What Makes StudySync Stand Out?</h3>
          <div className="landing-features-list">
            {features.map((feature, index) => (
              <div key={index} className={`landing-feature-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="landing-feature-content">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="landing-footer" role="contentinfo">
        <div className="landing-container">
          <h4>Contact Us</h4>
          <p>Email: <a href="mailto:hello@studysync.app">hello@studysync.app</a></p>
          <p>© {new Date().getFullYear()} StudySync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
