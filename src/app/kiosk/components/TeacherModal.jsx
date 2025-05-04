import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
const baseApiUrl = import.meta.env.VITE_API_URL
// Modal component
const TeacherModal = ({ isOpen, onClose, teachers, handleUserClicked }) => {

  console.log(teachers);
  if (!isOpen) return null;

  const handleTeacherClick = (teachers, teacher_id, selected_teacher) => {
    Swal.fire({
      title: `<p class="text-lg font-semibold">${selected_teacher.name}</p>`,
      html: `
        <div class="flex flex-col items-center space-y-3">
          <img src="${baseApiUrl}/storage/${selected_teacher.file_path}" 
               alt="Teacher" 
               style="width: 100%; height: 70vh; object-fit: cover;" />
          <p><span class="font-semibold">Email:</span> ${selected_teacher.email}</p>
          <p><span class="font-semibold">Floor:</span> ${selected_teacher.floor}</p>
          <p><span class="font-semibold">Unit ID:</span> ${selected_teacher.floorplan_unit_id}</p>
          <p class="text-sm text-gray-500">${new Date(selected_teacher.created_at).toLocaleString()}</p>
        </div>
      `,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: "Navigate",
      customClass: {
        popup: "rounded-xl shadow-lg p-6",
        confirmButton:
          "bg-green-500 hover:bg-blue-600 text-white px-4 py-2 rounded",
      },
      allowOutsideClick: false, // 🔒 disable outside click
      allowEscapeKey: false, // optional: disable ESC key
      preConfirm: () => {
        // 🧭 handle navigation when "Navigate" is clicked
        console.log("Navigate:", teacher_id, teachers)
        handleUserClicked(teachers, teacher_id);
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl mb-4">Select a Teacher</h2>
        <ul className="grid grid-cols-2 gap-2">
          {teachers?.teachers?.map((teacher) => (
            <li
              key={teacher.id}
              // onClick={() =>
              // {
              //     handleUserClicked(teachers, teacher.id);
              //     onClose();
              // }
              // }
              onClick={() => handleTeacherClick(teachers, teacher.id, teacher)}
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
