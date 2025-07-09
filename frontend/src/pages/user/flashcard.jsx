import React, { useState, useEffect } from 'react';
import { FaRandom, FaArrowLeft } from 'react-icons/fa';
import './flashcard.css';
import {
  getAllFlashcards,
  updateCardStatus,
} from '../../services/flashcardService';

const Flashcards = () => {
  const [topicsData, setTopicsData] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mixedSession, setMixedSession] = useState(false);
  const [progress, setProgress] = useState({
    studied: 0,
    difficult: 0,
    streak: 0,
  });

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await getAllFlashcards();
      const formattedTopics = res.data.map((topic) => {
        const knownCount = topic.cards?.filter((c) => c.known).length || 0;
        const progress =
          topic.cards?.length > 0
            ? (knownCount / topic.cards.length) * 100
            : 0;
        return {
          ...topic,
          cardCount: topic.cards?.length || 0,
          progress,
        };
      });
      setTopicsData(formattedTopics);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  };

  const handleTopicClick = (topic) => {
    const knownCount = topic.cards?.filter((c) => c.known).length || 0;
    const progress =
      topic.cards?.length > 0
        ? (knownCount / topic.cards.length) * 100
        : 0;

    setSelectedTopic({
      ...topic,
      progress,
    });
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setFilter('all');
    updateProgress(topic);
  };

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = () => {
    const cards = getFilteredCards();
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleMarkKnown = async () => {
    try {
      const card = getFilteredCards()[currentCardIndex];
      const updated = await updateCardStatus(
        selectedTopic._id,
        card._id,
        { known: !card.known }
      );

      const updatedCard = updated.data.card;
      const updatedCards = selectedTopic.cards.map((c) =>
        c._id === updatedCard._id
          ? { ...c, known: updatedCard.known }
          : c
      );

      const updatedTopic = {
        ...selectedTopic,
        cards: updatedCards,
      };

      setSelectedTopic(updatedTopic);
      updateProgress(updatedTopic);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkDifficult = async () => {
    try {
      const card = getFilteredCards()[currentCardIndex];
      const updated = await updateCardStatus(
        selectedTopic._id,
        card._id,
        { difficult: !card.difficult }
      );

      const updatedCard = updated.data.card;
      const updatedCards = selectedTopic.cards.map((c) =>
        c._id === updatedCard._id
          ? { ...c, difficult: updatedCard.difficult }
          : c
      );

      const updatedTopic = {
        ...selectedTopic,
        cards: updatedCards,
      };

      setSelectedTopic(updatedTopic);
      updateProgress(updatedTopic);
    } catch (error) {
      console.error(error);
    }
  };

  const updateProgress = (topic) => {
    const knownCount = topic.cards?.filter((c) => c.known).length || 0;
    const difficultCount = topic.cards?.filter((c) => c.difficult).length || 0;
    const progressPercent =
      topic.cards?.length > 0
        ? (knownCount / topic.cards.length) * 100
        : 0;

    setProgress({
      studied: knownCount,
      difficult: difficultCount,
      streak: progress.streak + 1,
    });

    setSelectedTopic((prev) => ({
      ...prev,
      progress: progressPercent,
    }));

    setTopicsData((prev) =>
      prev.map((t) =>
        t._id === topic._id
          ? { ...t, progress: progressPercent }
          : t
      )
    );
  };

  const handleShuffle = () => {
    const cards = [...selectedTopic.cards];
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    setSelectedTopic({ ...selectedTopic, cards });
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const getFilteredCards = () => {
    const cards = selectedTopic?.cards || [];
    return cards.filter((card) => {
      if (filter === 'all') return true;
      if (filter === 'starred') return card.difficult;
      if (filter === 'known') return card.known;
      return true;
    });
  };

  const getMixedCards = () => {
    return topicsData.flatMap((topic) => topic.cards);
  };

  const handleMixedSession = () => {
    const mixedCards = getMixedCards();
    const mixedTopic = {
      title: 'Mixed Session',
      cards: mixedCards,
      cardCount: mixedCards.length,
      progress: 0,
    };
    setMixedSession(true);
    setSelectedTopic(mixedTopic);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    updateProgress(mixedTopic);
  };

  const handleBack = () => {
    setSelectedTopic(null);
    setMixedSession(false);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const filteredTopics = topicsData.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cardsToShow = selectedTopic ? getFilteredCards() : [];

  return (
    <div className="flashcards-page">
      <div className="flashcards-container">
        {!selectedTopic && (
          <div className="flashcards-header">
            <div className="title-group">
              <h2>My Flashcards Library</h2>
              <span>{topicsData.length} topics</span>
            </div>
            <div className="header-actions">
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
              />
              <button
                className="action-btn"
                onClick={handleMixedSession}
              >
                Mixed Session
              </button>
            </div>
          </div>
        )}
        {!selectedTopic ? (
          <div className="flashcards-grid">
            {filteredTopics.map((topic) => (
              <div
                className="flashcard-card"
                key={topic._id}
                onClick={() => handleTopicClick(topic)}
              >
                <div className="flashcard-info">
                  <h4>{topic.title}</h4>
                  <p className="flashcard-subject">{topic.subject}</p>
                  <p className="flashcard-size">{topic.cardCount} Cards</p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${topic.progress?.toFixed(0) || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="flashcard-actions">
                  <button
                    className="action-btn"
                    onClick={() => handleTopicClick(topic)}
                  >
                    Start Studying
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="topic-view">
            <div className="topic-header">
              <div className="title-group">
                <h2>{selectedTopic.title}</h2>
                <span>
                  {mixedSession
                    ? getMixedCards().length
                    : selectedTopic.cardCount || 0} Cards
                </span>
              </div>
              <div className="header-actions">
                <select
                  className="filter-select"
                  onChange={(e) => setFilter(e.target.value)}
                  value={filter}
                >
                  <option value="all">All Cards</option>
                  <option value="starred">Starred Cards</option>
                  <option value="known">Known Cards</option>
                </select>
                <button
                  className="action-btn"
                  onClick={handleShuffle}
                >
                  <FaRandom /> Shuffle
                </button>
                <button
                  className="action-btn"
                  onClick={handleBack}
                >
                  <FaArrowLeft /> Back to Topics
                </button>
              </div>
            </div>
            <div className="flashcard-viewer">
              {cardsToShow.length > 0 ? (
                <div
                  className={`flashcard ${isFlipped ? 'flipped' : ''}`}
                  onClick={handleFlip}
                >
                  <div className="flashcard-inner">
                    <div className="flashcard-front">
                      <p>{cardsToShow[currentCardIndex].front}</p>
                    </div>
                    <div className="flashcard-back">
                      <p>{cardsToShow[currentCardIndex].back}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p>No cards available</p>
              )}
              <div className="flashcard-controls">
                <button
                  className="action-btn"
                  onClick={handlePrevious}
                  disabled={currentCardIndex === 0}
                >
                  Previous
                </button>
                <button
                  className="action-btn"
                  onClick={handleMarkKnown}
                >
                  {cardsToShow[currentCardIndex]?.known
                    ? 'Unmark Known'
                    : 'Mark Known'}
                </button>
                <button
                  className="action-btn mark-difficult"
                  onClick={handleMarkDifficult}
                >
                  {cardsToShow[currentCardIndex]?.difficult
                    ? 'Unmark Difficult'
                    : 'Mark Difficult'}
                </button>
                <button
                  className="action-btn"
                  onClick={handleNext}
                  disabled={currentCardIndex >= cardsToShow.length - 1}
                >
                  Next
                </button>
              </div>
            </div>
            <div className="progress-tracking">
              <h3>Progress</h3>
              <div className="progress-stats">
                <span>Cards Studied: {progress.studied}</span>
                <span>Cards Marked Difficult: {progress.difficult}</span>
                <span>Current Streak: {progress.streak}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcards;
