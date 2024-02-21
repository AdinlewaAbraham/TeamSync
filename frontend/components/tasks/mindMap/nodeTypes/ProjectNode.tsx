import { useMindMapStore } from "@/store/mindMapStore";
import { useCallback } from "react";
import { Handle, Position } from "reactflow";

const handleStyle = { left: 10 };

type Props = {
  data: any;
  isConnectable: boolean;
};
const ProjectNode: React.FC<Props> = ({ data, isConnectable }) => {
  console.log(data, isConnectable);

  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  const { orientation } = useMindMapStore();
  return (
    <div className="text-updater-node">
      <div className="h-9 w-36 rounded-md bg-accent-blue"></div>
      <Handle
        type="source"
        position={Position[orientation]}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default ProjectNode;
