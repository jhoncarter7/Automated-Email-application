import  { useEffect, useState } from 'react'; 
import Modal from 'react-modal';
import PropTypes from "prop-types";


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    minWidth: '400px',
    maxWidth: '90%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
   overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const EmailModal = ({ isOpen, onClose, initialData, onSubmit }) => {
  // State for subject and content, initialized from initialData prop
  const [subject, setSubject] = useState(initialData?.subject || '');
  const [content, setContent] = useState(initialData?.content || '');

  // Effect to update internal state if initialData prop changes while modal is open
  // This is useful if the same modal instance is reused for editing different nodes
  useEffect(() => {
      if (isOpen) {
          setSubject(initialData?.subject || '');
          setContent(initialData?.content || '');
      }
      // Reset when modal closes (optional, depends on desired behavior)
      // else {
      //     setSubject('');
      //     setContent('');
      // }
  }, [initialData, isOpen]); 

  // Handler for the submit button
  const handleSubmit = () => {
      // Pass an object containing the current subject and content state
      onSubmit({ subject, content });
      // Optionally reset state after submit if the modal stays open briefly
      // setSubject('');
      // setContent('');
      // onClose(); // Usually FlowChart handles closing via setModalType(null) in its onSubmit handler
  };

  return (
    <Modal
        isOpen={isOpen}
        onRequestClose={onClose} 
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Compose Email Modal"
    >
      <div className="p-4"> 
        <h2 className="text-xl font-bold mb-4 text-gray-800">Compose Email</h2>
        <label htmlFor="email-subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject:
        </label>
        <input
          id="email-subject"
          type="text"
          placeholder="Email Subject"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500"
          value={subject}
       
          onChange={(e) => setSubject(e.target.value)}
        />
       
        <label htmlFor="email-content" className="block text-sm font-medium text-gray-700 mb-1">
            Content:
        </label>
        <textarea
          id="email-content"
          placeholder="Email Body Content"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 h-32 resize-none focus:ring-blue-500 focus:border-blue-500" // Added resize-none
     
          value={content}
       
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
      
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  
            disabled={!subject || !content}
          >
            {initialData?.id ? 'Update Email' : 'Add Email'}
          </button>
        </div>
      </div>
    </Modal>
  );
};


EmailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
      id: PropTypes.string, 
      subject: PropTypes.string,
      content: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
};

EmailModal.defaultProps = {
 initialData: { subject: '', content: '' }
};

export default EmailModal;
