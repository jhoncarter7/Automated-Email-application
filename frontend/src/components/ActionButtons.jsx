/* eslint-disable react/prop-types */
const ActionButtons = ({ onStartProcess, onSaveAndSchedule, isProcessReady }) => {
    return (
      <div className="flex gap-4">
        <button
          onClick={onStartProcess}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Start Process
        </button>
        {isProcessReady && (
          <button
            onClick={onSaveAndSchedule}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save & Schedule
          </button>
        )}
      </div>
    );
  };
  
  export default ActionButtons;