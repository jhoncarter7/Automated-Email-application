import  { useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";


import StepTypeModal from "./StepTypeModal";
import LeadSourceModal from "./LeadSourceModal";
import EmailModal from "./EmailModal";
import DelayModal from "./DelayModal";
import AddNodeButton from "./AddNodeButton";
import ActionButtons from "./ActionButtons";

const nodeTypes = {};
const edgeTypes = {};
// -----------------------------------------------------------

// Initial node for the sequence start
const initialNodes = [

  {
    id: "start",
    data: { label: "Sequence Start Point", type: "start" },
    position: { x: 150, y: 50 },
    type: "input",
    style: {
      backgroundColor: "#e0f2fe",
      border: "1px solid #0ea5e9",
      borderRadius: "8px",
      padding: "15px 25px",
      width: 180,
      textAlign: "center",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    },
  },
];

const FlowChart = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});
  const [sourceNodeIdForNewNode, setSourceNodeIdForNewNode] = useState(null);
  const [isProcessReady, setIsProcessReady] = useState(false);
  const [delay, setDelay] = useState(0)

  const addNewNode = useCallback(
    (type, data, sourceId) => {
      const newNodeId = uuidv4();
      setNodes((nds) => {
        const sourceNode = nds.find((n) => n.id === sourceId);
        if (!sourceNode) {
          console.error("Source node not found for adding new node:", sourceId);
          return nds;
        }

        const newNode = {
          id: newNodeId,
          data: { ...data, type },
          position: {
            x: sourceNode.position.x,
            y: sourceNode.position.y + 150,
          },
          style: {
            backgroundColor: "#ffffff",
            border: "1px solid #7dd3fc",
            borderRadius: "8px",
            padding: "15px",
            width: 200,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          },
        };
        return [...nds, newNode];
      });
      setEdges((eds) => {
        const newEdge = {
          id: uuidv4(),
          source: sourceId,
          target: newNodeId,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
        };
        return [...eds, newEdge];
      });
      setIsProcessReady(true);
      setSourceNodeIdForNewNode(null);
      setModalType(null);
      setModalData({});
    },
    [setNodes, setEdges]
  );


  const updateNodeData = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, ...newData } };
          }
          return node;
        })
      );
      setModalType(null);
      setModalData({});
    },
    [setNodes]
  );


  const handleInitiateAddNode = () => {
    const potentialSourceId =
      nodes.length === 1 ? "start" : nodes[nodes.length - 1]?.id;
    if (!potentialSourceId) {
      console.error("Cannot determine source node for adding.");
      return;
    }
    setSourceNodeIdForNewNode(potentialSourceId);
    setModalData({});
    setModalType("step-type");
  };
  const handleNodeClick = useCallback((event, node) => {
    console.log("Node clicked:", node);
    setSourceNodeIdForNewNode(node.id);
    if (node.data.type === "email" || node.data.type === "delay") {
      setModalData({ ...node.data, id: node.id });
      setModalType(node.data.type);
    } else {
      setModalData({});
      setModalType(null);
    }
  }, []);

  const handleSubmitLeadSource = (email) => {
    if (!sourceNodeIdForNewNode) {
      console.error("Source node ID for new lead source is missing.");
      alert("Error: Cannot determine where to add the lead source.");
      return;
    }
    addNewNode(
      "lead-source",
      { label: `Lead Source\nEmail: ${email}` },
      sourceNodeIdForNewNode
    );
  };

  const handleSubmitEmail = (newEmailData) => {
    if (modalData.id) {
      console.log("Updating email node:", modalData.id);
      updateNodeData(modalData.id, {
        label: `Cold Email\nSubject: ${newEmailData.subject}\n${newEmailData.content}`,
      });
    } else {
      if (!sourceNodeIdForNewNode) {
        console.error("Source node ID for new email node is missing.");
        alert("Error: Cannot determine where to add the email node.");
        return;
      }
      console.log("Adding new email node from:", sourceNodeIdForNewNode);
      addNewNode(
        "email",
        {
          label: `Cold Email\nSubject: ${newEmailData.subject}\n${newEmailData.content}`,
        },
        sourceNodeIdForNewNode
      );
    }
  };

  const handleSubmitDelay = (newDelayData) => {
    console.log("delay", newDelayData)
    setDelay(Number(newDelayData.split(" ")[0]))
    if (modalData.id) {
      console.log("Updating delay node:", modalData.id);
      updateNodeData(modalData.id, {
        label: `Wait/Delay\n${newDelayData}`,
      });
    } else {
      if (!sourceNodeIdForNewNode) {
        console.error("Source node ID for new delay node is missing.");
        alert("Error: Cannot determine where to add the delay node.");
        return;
      }
      console.log("Adding new delay node from:", sourceNodeIdForNewNode);
      addNewNode(
        "delay",
        { label: `Wait/Delay\n${newDelayData}` },
        sourceNodeIdForNewNode
      );
    }
  };

  const handleStartProcess = async () => {
    const leadNode = nodes.find((n) => n.data.type === "lead-source");
    const leadEmail = leadNode?.data?.label?.split("Email: ")[1];

    if (!leadEmail) {
      alert(
        "Lead source email not found in the sequence. Please add a Lead Source node."
      );
      return;
    }
    console.log("Starting process with Lead Email:", delay);
    console.log("Nodes:", nodes);
    console.log("Edges:", edges);
    try {
      const response = await axios.post(
        `/api/sequence/save-schedule`,
        {
          leadEmail: leadEmail,
          delay: delay,
          nodes: nodes.map((n) => ({
            id: n.id,
            data: n.data,
            position: n.position,
          })),
          edges: edges.map((e) => ({
            id: e.id,
            source: e.source,
            target: e.target,
          })),
        }
      );
      alert(response.data?.message || "Process started successfully!");
      console.log("Backend Response:", response.data);
    } catch (error) {
      console.error(
        "Error starting process:",
        error.response?.data || error.message
      );
      alert(
        `Error starting process: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };


  return (
    <div className="w-full flex flex-col min-h-screen bg-gray-50">
      <div className="w-full flex items-center justify-center gap-4 py-3 px-4 bg-white shadow-sm z-10 border-b border-gray-200">

        <AddNodeButton onClick={handleInitiateAddNode} />
        <ActionButtons
          onStartProcess={handleStartProcess}
          isProcessReady={isProcessReady}
          onSaveAndSchedule={handleStartProcess}
        />
      </div>
      <div className="flex-grow w-full h-[calc(100vh-60px)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
 
          proOptions={{ hideAttribution: true }}
        >
          <Background variant="dots" gap={16} size={1} />
          <Controls />
        </ReactFlow>
      </div>

      <StepTypeModal
        isOpen={modalType === "step-type"}
        onClose={() => setModalType(null)}
        onSelect={(type) => {
          setModalData({});
          if (
            type === "lead-source" &&
            nodes.some((n) => n.data.type === "lead-source")
          ) {
            alert("Only one Lead Source node is allowed per sequence.");
            setModalType(null);
            setSourceNodeIdForNewNode(null);
          } else {
            setModalType(type);
          }
        }}
      />
      {/* ... LeadSourceModal ... */}
      <LeadSourceModal
        isOpen={modalType === "lead-source"}
        onClose={() => {
          setModalType(null);
          setSourceNodeIdForNewNode(null);
        }}
        onSubmit={handleSubmitLeadSource}
      />
      {/* ... EmailModal ... */}
      <EmailModal
        isOpen={modalType === "email"}
        onClose={() => {
          setModalType(null);
          setModalData({});
        }}
        initialData={
          modalData.id
            ? {
                id: modalData.id,
                subject:
                  modalData.label?.split("Subject: ")[1]?.split("\n")[0] || "",
                content: modalData.label?.split("\n").slice(2).join("\n") || "",
              }
            : { subject: "", content: "" }
        }
        onSubmit={handleSubmitEmail}
      />
      {/* ... DelayModal ... */}
      <DelayModal
        isOpen={modalType === "delay"}
        onClose={() => {
          setModalType(null);
          setModalData({});
        }}
        initialDelay={modalData.id ? modalData.label?.split("\n")[1] : "1 min"}
        onSubmit={handleSubmitDelay}
      />
    </div>
  );
};

export default FlowChart;
