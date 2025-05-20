import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showConfirmToast = ({ message, onConfirm, onCancel }) => {
  toast(
    ({ closeToast }) => (
      <div className="p-3">
        <p className="text-gray-800 mb-3">{message || "Are you sure?"}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              onCancel?.();
              closeToast();
            }}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            No
          </button>
          <button
            onClick={() => {
              onConfirm?.();
              closeToast();
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Yes
          </button>
        </div>
      </div>
    ),
    {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
      hideProgressBar: true,
    }
  );
};
