import { fetchEventSource } from "@microsoft/fetch-event-source";
import { AssistantTurn, PlanStep } from "@/components/chat/streamTypes";
import { AssistantCanvasData } from "@/components/chat/types";

export interface StreamingCallbacks {
  onUpdate: (turn: AssistantTurn) => void;
  onComplete: (turn: AssistantTurn) => void;
  onError: (error: Error) => void;
}

export function streamAgenticResponse(prompt: string, callbacks: StreamingCallbacks) {
  const currentTurn: AssistantTurn = {
    id: `turn_${Date.now()}`,
    plan: null,
    agentSteps: [],
    finalResponse: null,
    isComplete: false,
  };

  const updateAndNotify = () => callbacks.onUpdate({ ...currentTurn });
  const user_role = "hr";
  const user_id = "56188949-797a-481d-bbae-698e0ef99c3f"
  const company_id = "d8a4811f-8e32-4e59-a998-d5ce3a642ed6";
  let closed = false;
  fetchEventSource("http://localhost:8000/query-stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      // "Authorization": `Bearer ${authToken}`
    },
    body: JSON.stringify({
      query: prompt,
      save_history: true,
      user_role: user_role,
      user_id: user_id,
      company_id : company_id
    }),
    async onopen(response) {
      if (response.ok) {
        console.log("SSE connection established");
      } else {
        throw new Error(`Failed to connect: ${response.statusText}`);
      }
    },
    onmessage(msg) {
      console.log(msg)
      try {
        const eventType = msg.event || "message";
        const parsedData = msg.data ? JSON.parse(msg.data) : null;

        switch (eventType) {
          case "plan":
            currentTurn.plan = parsedData.steps;
            currentTurn.agentSteps = (parsedData.steps as PlanStep[]).map((step, index) => ({
              index: index + 1,
              agent: step.agent,
              query: step.query,
              status: "pending",
            }));
            break;
          case "agent_start":
            {
              const step = currentTurn.agentSteps.find(s => s.index === parsedData.index);
              if (step) step.status = "running";
            }
            break;
          case "agent_code":
            {
              const step = currentTurn.agentSteps.find(s => s.index === parsedData.index);
              if (step) step.code = { language: parsedData.language, code: parsedData.code };
            }
            break;
          case "agent_output":
            {
              const step = currentTurn.agentSteps.find(s => s.index === parsedData.index);
              if (step) {
                step.status = "completed";
                step.output = parsedData.output ?? parsedData.preview;
              }
            }
            break;
          case "agent_error":
            {
              const step = currentTurn.agentSteps.find(s => s.index === parsedData.index);
              if (step) {
                step.status = "error";
                step.error = parsedData.message;
              }
            }
            break;
          case "final_response":
            currentTurn.finalResponse =
              typeof parsedData === "object" && parsedData.text ? parsedData.text : String(parsedData);
            break;
          case "canvas":
            (currentTurn as any).canvasFlag = Boolean(parsedData?.iscanvas);
            break;
          case "final_payload":
            currentTurn.canvasData = parsedData as AssistantCanvasData;
            break;
          case "assets":
            (currentTurn as any).assets = parsedData;
            break;
          case "done":
            currentTurn.isComplete = true;
            callbacks.onComplete(currentTurn);
            closed = true;
            break;
          case "error":
            callbacks.onError(new Error(parsedData.message || "Unknown error"));
            closed = true;
            break;
        }
        updateAndNotify();
      } catch (err) {
        console.error("Parse error:", err);
      }
    },
    onerror(err) {
      console.error("SSE failed:", err);
      callbacks.onError(err instanceof Error ? err : new Error(String(err)));
      closed = true;
    },
    async onclose() {
      if (!closed) {
        console.warn("SSE closed unexpectedly");
      }
    },
    openWhenHidden: true, // optional
  });

  return () => {
    closed = true;
  };
}
