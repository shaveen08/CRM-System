import React, { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CloudUploadIcon, InformationCircleIcon } from "@hugeicons/core-free-icons";

const UploadModal = ({ isOpen, onClose, downloadCSVBtn }) => {
  const [attachedFile, setAttachedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const modalRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachedFile(file);
  };

  const handleUploadFile = () => {
    console.log(attachedFile);
  };

  const clearFile = () => setAttachedFile(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setAttachedFile(droppedFile);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      onClick={(e) => {
        if (e.target === modalRef.current) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-primary-50 p-4">
          <div>
            <h4 className="text-base font-semibold text-gray-800">
              Upload File
            </h4>
            <p className="text-sm text-gray-500">
              Select file to start processing
            </p>
          </div>
          <div
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white hover:bg-gray-100 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} color="#6b7280" />
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col items-center gap-3">
          <div className="w-full flex flex-col gap-4">
            {/* Drop zone */}
            <label
              htmlFor="upload-lead"
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`h-50 flex flex-col items-center justify-center cursor-pointer text-sm rounded-lg border border-dashed ${
                isDragging
                  ? "bg-blue-50 border-blue-500"
                  : "bg-gray-50 border-gray-300"
              }`}
            >
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center mb-1 border border-gray-300">
                <HugeiconsIcon icon={CloudUploadIcon} />
              </div>
              <h4>Choose a file or drag and drop here</h4>
              <p className="text-gray-500 text-xs mt-1">
                Only .CSV file is supported
              </p>
              <input
                type="file"
                id="upload-lead"
                className="hidden"
                accept=".csv"
                onChange={handleFileChange}
              />
            </label>

            {/* Attached file */}
            <div>
              {attachedFile ? (
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-sm flex items-center justify-between">
                  <span>{attachedFile.name}</span>
                  <button type="button" onClick={clearFile}>
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      size={18}
                      color="#6b7280"
                    />
                  </button>
                </div>
              ) : (
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500">
                  <p className="flex items-center gap-1.5"><HugeiconsIcon icon={InformationCircleIcon} size={16} strokeWidth={2} />{" "} Please upload file.</p>
                </div>
              )}
            </div>

            {/* Templates */}
            <div className="flex flex-col gap-1 items-start">
              <h4 className="mb-1 font-medium text-sm">Get Start</h4>
              <a
                href="#"
                className="text-sm text-primary-500"
                onClick={() => downloadCSVBtn()}
              >
                Download CSV import template
              </a>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex w-full gap-3 mt-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadFile}
              className="flex-1 rounded-lg bg-primary-600 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
