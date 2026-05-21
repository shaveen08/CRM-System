import React from "react";

const Skeleton = () => {
  return (
    <div className="flex h-screen animate-pulse bg-gray-200 rounded-md">

      {/* Sidebar */}
      <div className="w-64 p-4 space-y-4 border-r">
        <div className="h-8 w-3/4"></div>
        <div className="h-6 w-full"></div>
        <div className="h-6 w-full"></div>
        <div className="h-6 w-full"></div>
        <div className="h-6 w-5/6"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="h-6 w-1/4"></div>
          <div className="h-10 w-24"></div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-24 w-full"></div>
          <div className="h-24 w-full"></div>
          <div className="h-24 w-full"></div>
        </div>

        {/* Content / Table */}
        <div className="space-y-3">
          <div className="h-10 w-full"></div>
          <div className="h-10 w-full"></div>
          <div className="h-10 w-full"></div>
          <div className="h-10 w-5/6"></div>
        </div>

      </div>
    </div>
  );
};

export default Skeleton;