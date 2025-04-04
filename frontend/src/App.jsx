
import FlowChart from "./components/FlowChart";
import "./App.css";

function App() {
  return (
    <div className="h-screen w-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-[#153448]">
          Automated Email Sequencer
        </h1>
        <div className="h-[calc(100vh-150px)] border rounded-lg shadow-lg overflow-hidden">
          <FlowChart />
        </div>
      </div>
    </div>
  );
}

export default App;