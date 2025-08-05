import React from "react";
import Pagination from "../components/Pagination";

export default function PaginationDemo() {
    const [currentPage, setCurrentPage] = React.useState(1);
    
    // Simulate different scenarios
    const scenarios = [
        { name: "Small result set (50 items)", totalCount: 50 },
        { name: "Medium result set (500 items)", totalCount: 500 },
        { name: "Large result set (2000 items - GitHub limited)", totalCount: 2000 },
        { name: "Very large result set (10000 items - GitHub limited)", totalCount: 10000 },
    ];
    
    const [scenarioIndex, setScenarioIndex] = React.useState(2);
    const currentScenario = scenarios[scenarioIndex];
    
    const maxResults = Math.min(currentScenario.totalCount, 1000);
    const totalPages = Math.ceil(maxResults / 10);
    const hasNextPage = currentPage < Math.min(totalPages, 100);
    
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h1 className="text-center mb-4">Pagination Component Demo</h1>
                    
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">Test Scenarios</h5>
                            <div className="btn-group mb-3" role="group">
                                {scenarios.map((scenario, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`btn ${index === scenarioIndex ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                                        onClick={() => {
                                            setScenarioIndex(index);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {scenario.name}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="row">
                                <div className="col-md-6">
                                    <p><strong>Total Results:</strong> {currentScenario.totalCount.toLocaleString()}</p>
                                    <p><strong>Max Viewable (GitHub limit):</strong> {maxResults.toLocaleString()}</p>
                                    <p><strong>Total Pages:</strong> {totalPages}</p>
                                </div>
                                <div className="col-md-6">
                                    <p><strong>Current Page:</strong> {currentPage}</p>
                                    <p><strong>Max Page (GitHub limit):</strong> {Math.min(totalPages, 100)}</p>
                                    <p><strong>Has Next Page:</strong> {hasNextPage ? 'Yes' : 'No'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card">
                        <div className="card-body text-center">
                            <h5 className="card-title mb-4">Pagination Component</h5>
                            <Pagination
                                page={currentPage}
                                setPage={setCurrentPage}
                                hasNextPage={hasNextPage}
                                totalCount={currentScenario.totalCount}
                            />
                        </div>
                    </div>
                    
                    <div className="alert alert-info mt-4">
                        <h6>Features Demonstrated:</h6>
                        <ul className="mb-0">
                            <li><strong>Smart Page Numbers:</strong> Shows up to 5 visible page buttons with ellipsis</li>
                            <li><strong>GitHub Limit Handling:</strong> Respects the 100-page limit (1000 results max)</li>
                            <li><strong>Responsive Design:</strong> Adapts to different screen sizes</li>
                            <li><strong>Accessibility:</strong> Proper ARIA labels and semantic markup</li>
                            <li><strong>Visual Feedback:</strong> Disabled states and hover effects</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
