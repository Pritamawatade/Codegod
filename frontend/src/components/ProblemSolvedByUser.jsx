import React, { useEffect } from "react";
import useProblemStore from "../store/useProblemStore";
import { Link } from "react-router-dom";
import {
  Tag,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Circle,
} from "lucide-react";

const ProblemSolvedByUser = () => {
  const { getSolvedProblemByUser, solvedProblems } = useProblemStore();

  useEffect(() => {
    getSolvedProblemByUser();
  }, [getSolvedProblemByUser]);

  // Function to get difficulty badge styling
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return (
          <div className="badge badge-success gap-1">
            <CheckCircle size={12} />
            Easy
          </div>
        );
      case "MEDIUM":
        return (
          <div className="badge badge-warning gap-1">
            <Circle size={12} />
            Medium
          </div>
        );
      case "HARD":
        return (
          <div className="badge badge-error gap-1">
            <AlertTriangle size={12} />
            Hard
          </div>
        );
      default:
        return <div className="badge badge-ghost">Unknown</div>;
    }
  };

  return (
    <div className="p-4 bg-white w-full  dark:bg-[#0c0d0e] border border-[#cabfbf] dark:border-[#3a3a40] ">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
          Problems Solved
        </h2>

        {solvedProblems.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="text-lg font-medium">No problems solved yet</h3>
              <p className="text-base-content/70">
                Start solving problems to see them listed here!
              </p>
              <div className="card-actions justify-end">
                <Link to="/problems" className="btn btn-primary">
                  View Problems
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full bg-gray-100 dark:bg-[#0b1018]">
                <thead>
                  <tr>
                    <th className="bg-gray-100 border-gray-300 dark:bg-[#0b1018] dark:text-white text-black border dark:border[#3a3a40]">
                      Problem
                    </th>
                    <th className="bg-gray-100 border-gray-300 dark:bg-[#0b1018] dark:text-white text-black border dark:border[#3a3a40]">
                      Difficulty
                    </th>
                    <th className="bg-gray-100 border-gray-300 dark:bg-[#0b1018] dark:text-white text-black border dark:border[#3a3a40]">
                      Tags
                    </th>
                    <th className="bg-gray-100 border-gray-300 dark:bg-[#0b1018] dark:text-white text-black border dark:border[#3a3a40] text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {solvedProblems.map((problem) => (
                    <tr key={problem.id} className="hover">
                      <td className="font-medium">{problem.title}</td>
                      <td>{getDifficultyBadge(problem.difficulty)}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {problem.tags &&
                            problem.tags.map((tag, index) => (
                              <div
                                key={index}
                                className="badge badge-outline badge-primary"
                              >
                                <Tag size={10} className="mr-1" />
                                {tag}
                              </div>
                            ))}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center">
                          <Link
                            to={`/problem/${problem.id}`}
                            className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-xl font-medium transition-all duration-300 transform cursor-pointer shadow-lg hover:shadow-xl flex items-center gap-2"
                          >
                            <ExternalLink size={14} className="mr-1" />
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card-footer bg-gray-100 dark:bg-[#0b1018] p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  Total problems solved:{" "}
                  <span className="font-bold">{solvedProblems.length}</span>
                </span>
                <Link
                  to="/problems"
                  className="group bg-gradient-to-r text-sm border bg-gray-100 dark:bg-[#0b1018] dark:border-gray-100 dark:hover:to-gray-900 text-black dark:text-white px-2 py-1 mt-4 rounded-xl  transition-all duration-300 transform cursor-pointer shadow-lg hover:shadow-xl flex items-center gap-1 dark:hover:text-gray-300 hover:text-gray-900"
                >
                  <ExternalLink size={14} className="mr-1" />
                  Solve more problems
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {solvedProblems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="stat bg-gray-100 dark:bg-[#0b1018] shadow rounded-box border dark:border-[#3a3a40]">
              <div className="stat-title text-gray-900 dark:text-white">
                Easy
              </div>
              <div className="stat-value text-success">
                {solvedProblems.filter((p) => p.difficulty === "EASY").length}
              </div>
            </div>
            <div className="stat bg-gray-100 dark:bg-[#0b1018] shadow rounded-box border dark:border-[#3a3a40]">
              <div className="stat-title text-gray-900 dark:text-white">
                Medium
              </div>
              <div className="stat-value text-warning">
                {solvedProblems.filter((p) => p.difficulty === "MEDIUM").length}
              </div>
            </div>
            <div className="stat bg-gray-100 dark:bg-[#0b1018] shadow rounded-box border dark:border-[#3a3a40]">
              <div className="stat-title text-gray-900 dark:text-white">
                Hard
              </div>
              <div className="stat-value text-error">
                {solvedProblems.filter((p) => p.difficulty === "HARD").length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemSolvedByUser;
