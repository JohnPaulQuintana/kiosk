import React, {useState,useEffect} from "react";

// Modal component
const TeacherModal = ({ isOpen, onClose, teachers, handleUserClicked }) => {
    if (!isOpen) return null;
  
    const handleTeacherClick = (teacher) => {
      // Handle teacher click (e.g., display more details or perform an action)
      alert(`Teacher clicked: ${teacher.name}`);
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl mb-4">Select a Teacher</h2>
          <ul className="grid grid-cols-2 gap-2">
            {teachers?.teachers?.map((teacher) => (
              <li
                key={teacher.id}
                onClick={() => 
                {
                    handleUserClicked(teachers, teacher.id);
                    onClose();
                }
                }
                className="cursor-pointer p-2 bg-gray-200 hover:bg-gray-300 uppercase rounded-lg mb-2"
              >
                {teacher.name}
              </li>
            ))}
          </ul>
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  export default TeacherModal;