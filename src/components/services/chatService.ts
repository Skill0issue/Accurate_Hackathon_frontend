import { AssistantTurn, PlanStep } from "@/components/chat/streamTypes";
import { AssistantCanvasData } from "@/components/chat/types";

/**
 * Defines the set of callbacks that the UI can provide to handle
 * the different events streamed from the backend.
 */
export interface StreamingCallbacks {
  onUpdate: (turn: AssistantTurn) => void;
  onComplete: (turn: AssistantTurn) => void;
  onError: (error: Error) => void;
}

/**
 * Connects to the backend's SSE endpoint and processes the agentic workflow stream.
 *
 * @param prompt The user's query.
 * @param callbacks An object of functions to handle updates, completion, and errors.
 * @returns A function to gracefully close the connection.
 */
export function streamAgenticResponse(prompt: string, callbacks: StreamingCallbacks) {
  const eventSource = new EventSource(`/api/chat?prompt=${encodeURIComponent(prompt)}`);

  let currentTurn: AssistantTurn = {
    id: `turn_${Date.now()}`,
    plan: null,
    agentSteps: [],
    finalResponse: null,
    isComplete: false,
  };

  const updateAndNotify = () => {
    callbacks.onUpdate({ ...currentTurn });
  };

  eventSource.addEventListener("plan", (event) => {
    const data = JSON.parse(event.data);
    currentTurn.plan = data.steps;
    // Initialize agent steps based on the plan
    currentTurn.agentSteps = (data.steps as PlanStep[]).map((step, index) => ({
      index: index + 1,
      agent: step.agent,
      query: step.query,
      status: "pending",
    }));
    updateAndNotify();
  });

  eventSource.addEventListener("agent_start", (event) => {
    const data = JSON.parse(event.data);
    const step = currentTurn.agentSteps.find(s => s.index === data.index);
    if (step) {
      step.status = "running";
    }
    updateAndNotify();
  });
  
  eventSource.addEventListener("agent_code", (event) => {
    const data = JSON.parse(event.data);
    const step = currentTurn.agentSteps.find(s => s.index === data.index);
    if (step) {
      step.code = { language: data.language, code: data.code };
    }
    updateAndNotify();
  });

  eventSource.addEventListener("agent_output", (event) => {
    const data = JSON.parse(event.data);
    const step = currentTurn.agentSteps.find(s => s.index === data.index);
    if (step) {
      step.status = "completed";
      step.output = data.output ?? data.preview;
    }
    updateAndNotify();
  });

  eventSource.addEventListener("agent_error", (event) => {
    const data = JSON.parse(event.data);
    const step = currentTurn.agentSteps.find(s => s.index === data.index);
    if (step) {
      step.status = "error";
      step.error = data.message;
    }
    updateAndNotify();
  });

  eventSource.addEventListener("final_response", (event) => {
    const data = JSON.parse(event.data);
    currentTurn.finalResponse = data.text;
    
    // Check if the payload contains canvas data and assign it to the turn
    if (data.iscanvas) {
      currentTurn.canvasData = data as AssistantCanvasData;
    }
    
    updateAndNotify();
  });

  eventSource.addEventListener("done", () => {
    currentTurn.isComplete = true;
    callbacks.onComplete(currentTurn);
    eventSource.close();
  });
  
  eventSource.onerror = (err) => {
    console.error("EventSource failed:", err);
    callbacks.onError(new Error("Connection to the streaming service was lost."));
    eventSource.close();
  };
  
  // Return a cleanup function
  return () => {
    eventSource.close();
  };
}
