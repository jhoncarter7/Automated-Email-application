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

// eslint-disable-next-line react/prop-types
const StepTypeModal = ({ isOpen, onClose, onSelect }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles} ariaHideApp={false}>
      <div className="p-6 min-w-[400px]">
        <h2 className="text-xl font-bold mb-4">Select Step Type</h2>
        <div className="space-y-2">
          <button
            onClick={() => onSelect('lead-source')}
            className="w-full p-3 text-left border rounded hover:bg-gray-400"
          >
            Lead Source
          </button>
          <button
            onClick={() => onSelect('email')}
            className="w-full p-3 text-left border rounded hover:bg-gray-400"
          >
            Cold Email
          </button>
          <button
            onClick={() => onSelect('delay')}
            className="w-full p-3 text-left border rounded hover:bg-gray-400"
          >
            Wait/Delay
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default StepTypeModal;