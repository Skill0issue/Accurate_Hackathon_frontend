import React from 'react';
import { AssistantTurn } from '../streamTypes';
import ThinkingComponent, { ThinkingData, ThinkingStep } from '../../response/ThinkingDropDown';
import ResponseText from '../../response/ResponseText';

// ... (transformTurnToThinkingData function remains the same) ...

const transformTurnToThinkingData = (turn: AssistantTurn): ThinkingData => {
    if (!turn || !turn.agentSteps) {
        return { steps: [], isComplete: false };
    }
    const thinkingSteps: ThinkingStep[] = turn.agentSteps.map((step) => {
        let status: ThinkingStep['status'] = 'pending';
        if (step.status === 'running') status = 'processing';
        if (step.status === 'completed') status = 'complete';
        if (step.status === 'error') status = 'error';

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


export const AgenticResponse: React.FC<{ turn: AssistantTurn }> = ({ turn }) => {
  const thinkingData = transformTurnToThinkingData(turn);

  // For now, we'll extract the first bolded line as the header.
  // A better long-term solution is for your API to send this separately.
  const extractHeader = (text: string | null): { header: string | undefined; body: string } => {
    if (!text) return { header: undefined, body: '' };

    const lines = text.split('\n');
    let header: string | undefined = undefined;
    let bodyStartIndex = 0;

    // Find the first non-empty line
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() !== '') {
            const firstLine = lines[i].trim();
            // Check if it's a markdown bold line
            if (firstLine.startsWith('**') && firstLine.endsWith('**')) {
                header = firstLine.replace(/\*\*/g, ''); // Remove the markdown
                bodyStartIndex = i + 1;
            }
            break; // We only check the very first content line
        }
    }

    const body = lines.slice(bodyStartIndex).join('\n');
    return { header, body };
  };
  
  const { header, body } = extractHeader(turn.finalResponse);

  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex items-end gap-3 w-full justify-start">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex-shrink-0" />
        {/* Changed max-w-3xl to max-w-full to fill the new container */}
        <div className="max-w-full space-y-2 w-full">
            
            {turn.plan && <ThinkingComponent thinking={thinkingData} />}
            
            {turn.finalResponse && (
              <ResponseText header={header} text={body} />
            )}
        </div>
      </div>
    </div>
  );
};

