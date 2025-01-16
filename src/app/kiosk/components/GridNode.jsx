const GridNode = ({ node, onClick, animatedNodes=[] }) => {
  const { isStart, isEnd, isWall, isPath, isAdjacent, row, col } = node;

  // Check if the current node is animated
  const isAnimated = animatedNodes.some(
    (animatedNode) => animatedNode.row === row && animatedNode.col === col
  );

  return (
    <div
      onClick={onClick}
      className={`w-[20px] h-[20px] ${
        isStart
          ? "bg-green-500"
          : isEnd
          ? "bg-red-500"
          : isWall
          ? "bg-gray-500"
          : isPath
          ? "bg-yellow-300 animate-node" // Path nodes have their own animation
          : isAdjacent
          ? "bg-blue-200" // Adjacent nodes' color
          : "bg-white"
      } ${isAnimated ? "animate-node" : ""} border border-gray-300`}
    ></div>
  );
};

export default GridNode;
