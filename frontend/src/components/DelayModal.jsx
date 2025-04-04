/* eslint-disable react/prop-types */
import { useState } from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const DelayModal = ({ isOpen, onClose,  onSubmit }) => {
  const [delay, setDelay] = useState("")
  console.log("got the delay", delay)
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
      <div className="p-6 min-w-[400px]">
        <h2 className="text-xl font-bold mb-4">Set Delay Duration</h2>
        <select
          className="w-full p-2 border rounded-lg mb-4"
          value={delay}
          onChange={(e) => setDelay(e.target.value)}
        >
          {[...Array(6).keys()].map((i) => (
            <option key={i} value={`${i + 1} min`}>
              {i + 1} min
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button
            onClick={()=> onSubmit(delay)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Delay
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DelayModal;