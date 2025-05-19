import React, { useEffect, useState } from 'react';// import React from 'react';
import axios from 'axios';


const Leaderboard = ({ quizName }) => {
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const url = quizName 
          ? `http://127.0.0.1:8000/api/leaderboard/${encodeURIComponent(quizName)}/`
          : 'http://127.0.0.1:8000/api/leaderboard/';
        
        const response = await axios.get(url);
        console.log('Leaderboard response:', response.data); // Debug log

        if (quizName && response.data.scores) {
          setScores({ [quizName]: response.data.scores });
        } else if (!quizName && typeof response.data === 'object') {
          setScores(response.data);
        } else {
          setScores({});
        }
      } catch (err) {
        console.error('Leaderboard error:', err);
        setError('Unable to load leaderboard');
        setScores({});
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [quizName]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        Error loading leaderboard: {error}
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {Object.entries(scores).map(([quizTitle, quizScores]) => (
        <div key={quizTitle} className="card shadow-sm mb-4">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">{quizTitle} - Top users</h5>
            <span className="badge bg-light text-primary">
              {quizScores.length} user
            </span>
          </div>
          <div className="card-body p-0">
            {quizScores.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="text-center" style={{width: "10%"}}>Rank</th>
                      <th style={{width: "50%"}}>User</th>
                      <th className="text-end" style={{width: "40%"}}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizScores.map((score, index) => (
                      <tr key={index} className={index < 3 ? 'table-warning' : ''}>
                        <td
                          {...(index >= 3 ? { style: { paddingRight: '33px' } } : {})}
                          className="text-center"
                        >
                          {index + 1}
                          {index < 3 && <span className="ms-1">🏆</span>}
                        </td>
                        <td>
                          <span className="fw-semibold">{score.username}</span>
                        </td>
                        <td className="text-end">
                          <span className={`badge ${index < 3 ? 'bg-warning text-dark' : 'bg-success'}`}>
                            {score.score}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 text-center text-muted">
                No scores available for {quizTitle}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
