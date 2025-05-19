import React, { useState, useEffect } from 'react';
import axios from 'axios';


function QuizListTable() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/quizzes/');
                console.log("Fetched quizzes data:", response.data);
                // Handle both array and paginated object response
                if (Array.isArray(response.data)) {
                    setQuizzes(response.data);
                } else if (response.data.results) {
                    setQuizzes(response.data.results);
                } else {
                    setQuizzes([]);
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleStartQuiz = (quizId) => {
        window.location.href = `/quiz?quiz_id=${quizId}`;
    };

    const handleViewDetails = (quiz) => {
        // You can implement a modal or navigation to detail page
        console.log('View details for quiz:', quiz);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center m-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger m-3" role="alert">
                Error loading quizzes: {error.message}
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-xl-10">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h5 className="card-title mb-0">Available Quizzes</h5>
                            <span className="badge bg-light text-primary">{quizzes.length} Quizzes</span>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th style={{width: "5%"}}>#</th>
                                            <th style={{width: "25%"}}>Title</th>
                                            <th style={{width: "30%"}}>Description</th>
                                            <th style={{width: "15%"}}>Created</th>
                                            <th style={{width: "10%"}} className="text-center">Questions</th>
                                            <th style={{width: "15%"}} className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quizzes.map((quiz) => (
                                            <tr key={quiz.id}>
                                                <td>{quiz.id}</td>
                                                <td className="fw-semibold">{quiz.title}</td>
                                                <td>{quiz.description}</td>
                                                <td>{new Date(quiz.created_At).toLocaleDateString()}</td>
                                                <td className="text-center">
                                                    <span className="badge bg-secondary">
                                                        {quiz.questions ? quiz.questions.length : 0}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <button 
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => handleStartQuiz(quiz.id)}
                                                        >
                                                            <i className="bi bi-play-fill"></i> Start
                                                        </button>
                                                        <button 
                                                            className="btn btn-outline-secondary btn-sm"
                                                            onClick={() => handleViewDetails(quiz)}
                                                        >
                                                            <i className="bi bi-info-circle"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuizListTable;
