
import { MessageSquare, ChevronDown} from "lucide-react";


const ChatHeader = ({ onToggle, isExpanded }: { onToggle: () => void,  isExpanded: boolean }) => (
  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
    <div className="flex items-center gap-3">
      <div className="bg-white/20 p-2 rounded-full"><MessageSquare className="h-6 w-6" /></div>
      <div>
        <h1 className="font-semibold text-lg">Phi-RA Assistant</h1>
        <p className="text-xs opacity-80">AI-powered data insights</p>
      </div>
    </div>
    <button onClick={onToggle} className="p-2 rounded-full hover:bg-white/20 transition-colors">
      <ChevronDown className={`h-6 w-6 transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`} />
    </button>
  </div>
);

export default ChatHeader;
