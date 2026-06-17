import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

const FilterModal = ({
  filter,
  selectedFilter,
  setSelectedFilter,
  onClose,
}) => {
    
  const handleSelectedFilter = (status) => {
    setSelectedFilter((prev) =>
      prev.includes(status)
        ? prev.filter((item) => item !== status)
        : [...prev, status],
    );
  };

  return (
    <div className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-gray-100 bg-white shadow-xl shadow-gray-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Filter by Status
        </p>

        <div className="cursor-pointer" onClick={onClose}>
          <HugeiconsIcon icon={Cancel01Icon} size={16} color="#757575" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {filter?.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => handleSelectedFilter(status)}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
              selectedFilter.includes(status)
                ? "bg-primary-100 text-primary-700 font-medium"
                : "hover:bg-gray-50 text-gray-600"
            }`}
          >
            {status}

            {selectedFilter.includes(status) && (
              <span className="h-2 w-2 rounded-full bg-primary-700" />
            )}
          </button>
        ))}
      </div>

      {selectedFilter.length > 0 && (
        <button
          onClick={() => setSelectedFilter([])}
          className="mt-3 w-full rounded-lg border border-gray-200 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterModal;
