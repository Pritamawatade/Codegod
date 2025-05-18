import React, { useEffect } from "react";

import  useProblemStore  from "../store/useProblemStore";
import { Loader } from "lucide-react";
import ProblemTable from "../components/ProblemTable";

function HomePage() {
   const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  if(isProblemsLoading){
    return (
      <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin"/>
      </div>
    )
  }

  return (
   <div className="min-h-screen flex flex-col items-center mt-14 px-4 bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-extrabold z-10 text-center">
       Become CodeGod in 30 days
      </h1>

      <p className="mt-4 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10">
        A Platform Inspired by Leetcode which helps you to prepare for coding
        interviews and helps you to improve your coding skills by solving coding
        problems
      </p>

      {
        problems.length > 0 ? <ProblemTable problems={problems}/> : (
            <p className="mt-10 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10 border border-primary px-4 py-2 rounded-md border-dashed">
          No problems found
        </p>
        )
      }
    </div>

  );
}

export default HomePage;
