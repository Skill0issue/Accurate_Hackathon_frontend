import React from 'react';
import { AssistantTurn } from '../streamTypes';
import ThinkingComponent, { ThinkingData, ThinkingStep } from '@/components/response/ThinkingDropDown';
import ResponseText from '@/components/response/ResponseText';

const transformTurnToThinkingData = (turn: AssistantTurn): ThinkingData => {
    if (!turn || !turn.agentSteps) {
        return { steps: [], isComplete: false };
    }
    const thinkingSteps: ThinkingStep[] = turn.agentSteps.map((step) => {
        let status: ThinkingStep['status'] = 'pending';
        if (step.status === 'running') status = 'processing';
        if (step.status === 'completed') status = 'complete';
        // if (step.status === 'error') status = 'error';

        return {
            id: step.index.toString(),
            title: step.agent,
            description: step.query,
            status: status,
            code: step.code,
            output: step.output,
        };
    });

    return {
        steps: thinkingSteps,
        isComplete: turn.isComplete,
    };
};

interface AgenticResponseProps {
  turn: AssistantTurn;
  onOpenCanvas: () => void;
}

export const AgenticResponse: React.FC<AgenticResponseProps> = ({ turn, onOpenCanvas }) => {
  const thinkingData = transformTurnToThinkingData(turn);

  const extractHeader = (text: string | null): { header: string | undefined; body: string } => {
    if (!text) return { header: undefined, body: '' };

    const lines = text.split('\n');
    let header: string | undefined = undefined;
    let bodyStartIndex = 0;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() !== '') {
            const firstLine = lines[i].trim();
            if (firstLine.startsWith('**') && firstLine.endsWith('**')) {
                header = firstLine.replace(/\*\*/g, '');
                bodyStartIndex = i + 1;
            }
            break; 
        }
    }

    const body = lines.slice(bodyStartIndex).join('\n');
    return { header, body };
  };
  
  const { header, body } = extractHeader(turn.finalResponse);
  const isCanvasAvailable = !!turn.canvasData?.iscanvas;

  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex items-end gap-3 w-full justify-start">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex-shrink-0" />
        <div className="max-w-full space-y-2 w-full">
            
            {turn.plan && <ThinkingComponent thinking={thinkingData} />}
            
            {turn.finalResponse && (
              <ResponseText
                header={header}
                text={body}
                isCanvas={isCanvasAvailable}
                onOpenCanvas={onOpenCanvas}
              />
            )}
        </div>
      </div>
    </div>
  );
};

