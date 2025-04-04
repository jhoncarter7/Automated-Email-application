import  { useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types'; 


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
    minWidth: '350px',
    maxWidth: '90%', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
};


const LeadSourceModal = ({ isOpen, onClose, onSubmit, Email }) => {

  const [email, setEmail] = useState(Email);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);


  const handleSubmit = () => {
    if (isEmailValid) {
      onSubmit(email); // Pass the email back to the parent
      setEmail(''); // Optionally clear the input after submission
      onClose(); // Close the modal
    } else {
   
      console.error("Invalid email format");
    }
  };

  // Handle closing the modal
  const handleClose = () => {
    setEmail(''); // Clear email input when closing
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose} 
      style={customStyles}
      ariaHideApp={false} 
      contentLabel="Enter Lead Email Modal" 
    >
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Enter Lead Email</h2>
        <label htmlFor="lead-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address:
        </label>
        <input
          id="lead-email"
          type="email"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500" // Added focus styles
          placeholder="e.g., lead@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" // Improved styling
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit} 
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              !isEmailValid
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' // Enabled style
            }`}
            disabled={!isEmailValid} 
          >
            Add Email
          </button>
        </div>
      </div>
    </Modal>
  );
};


LeadSourceModal.propTypes = {
  Email: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default LeadSourceModal;
